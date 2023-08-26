import mediapipe as mp
import cv2 #used to access webcam, and rendering and drawing capabilities
import numpy as np
import pandas as pd
import sys
import os
import pickle

fix = False

mp_drawing = mp.solutions.drawing_utils   #helps draw detections 
mp_holistic = mp.solutions.holistic   #this is the holistic model

print()

comm = open("comm.txt", "w+")

with open('../../ai_stuff/EvoSense_model.pkl', 'rb') as f:
    model = pickle.load(f)
    
camera = cv2.VideoCapture(0) 

# initiate holistic model
with mp_holistic.Holistic(min_detection_confidence = 0.5, min_tracking_confidence=0.5) as holistic: #getting the holistic model 
    
    while camera.isOpened():
        

        ret, frame = camera.read() #we will get image inside 'frame' variable
    
        #recolor feed
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) #webcam will be BGR, holistic model needs to be RGB
        image.flags.writeable = False #prevent copying the image data
        
        #make detections
        results = holistic.process(image)
        #print(results.face_landmarks)
        
        # recolor image back for rendering
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        
        #Draw face landmarks
        mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_CONTOURS, 
                                  mp_drawing.DrawingSpec(thickness=1, circle_radius=1),
                                  mp_drawing.DrawingSpec(thickness=1, circle_radius=1))
        
        #Right Hand:
        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
        
        #Left Hand:
        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
        
        #Pose Detections:
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
        
        # export coordinates
        try:
            # extracting pose landmarks
            pose = results.pose_landmarks.landmark #gives landmark
            pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in pose]).flatten()) #extracting all coords to a numpy array
            
            # extracting face landmarks
            face = results.face_landmarks.landmark
            face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in face]).flatten())
            
            # concate rows
            row = pose_row + face_row
        
            # make detections:
            X = pd.DataFrame([row])
            body_language_class = model.predict(X)[0]
            body_language_prob = model.predict_proba(X)[0]
            fix = True

            print(body_language_class)
            comm.write(body_language_class+"\n")
            #print(body_language_class, body_language_prob)
        
        except:
           print('Face not found')
        
        sys.stdout.flush()
        
        if(fix):
            # render the prediction on screen
            cv2.rectangle(image, (0,0), (250,60), (245, 117, 16), -1)
            
            # display class
            cv2.putText(image, 'CLASS',
                        (95,12),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA
                        )
            cv2.putText(image, body_language_class.split(' ')[0],
                        (90,40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA
                        )   
            
            # display problability
            cv2.putText(image, 'PROB',
                        (15,12),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA
                        )
            cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)],2)),
                        (10,40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA
                        )   
            
            
            
            cv2.imshow('Raw Webcam Feed', image)
        
            if cv2.waitKey(10) & 0xFF == ord('q'): #if q is hit stop the webcam
                break

camera.release()
cv2.destroyAllWindows()