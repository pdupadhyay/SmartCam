import face_recognition_models
import face_recognition
import cv2
import operations as op
import numpy as np

import tkinter as tk
from tkinter import messagebox

def run():
    # Get a reference to webcam #0 (the default one)
    video_capture = cv2.VideoCapture(0)

    # Load a sample picture and learn how to recognize it.
    #obama_image = face_recognition.load_image_file("obama.jpg")
    #obama_face_encoding = face_recognition.face_encodings(obama_image)[0]

    # Load a second sample picture and learn how to recognize it.
    #hiren_image = face_recognition.load_image_file("hiren_known.jpg")
    #hiren_face_encoding = face_recognition.face_encodings(hiren_image)[0]
    #op.insert(obama_face_encoding)
    

    # Create arrays of known face encodings, their names and their ids
    known_face_encodings = [
        #obama_face_encoding,
        #hiren_face_encoding
        #data[2]["face_encodings"]
    ]
    
    known_face_details=[

    ]
    data=op.read()
    
    #data containing face,name and ids are added in respective arrays
    for i in data:
        
        known_face_encodings.append(np.asarray(i["face_encodings"]))
        known_face_details.append([i["name"],i["faculty_id"]])
    if len(known_face_encodings)==0:
        
        messagebox.showinfo("Error", "No face encodings found. Please add face encodings and try again.")
        return
    #print(known_face_encodings)
    
    # Initialize some variables
    face_locations = []
    face_encodings = []
    faculty_id_check = []
    process_this_frame = True

    while True:
        # Grab a single frame of video
        ret, frame = video_capture.read()
       


        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Only process every other frame of video to save time
        if process_this_frame:
            # Find all the faces and face encodings in the current frame of video
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

            face_names = []
            face_faculty_id = []
            # face_attendance = []
            
            
            for face_encoding in face_encodings:
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.4)
                face_distances=face_recognition.face_distance(known_face_encodings,face_encoding)
                best_match_index=np.argmin(face_distances)
                
                name = "Unknown"
                faculty_id = 0
                # attendance = 0
                # If a match was found in known_face_encodings, just use the first one.
                
                if matches[best_match_index]:
                    # first_match_index = matches.index(True)
                    name = known_face_details[best_match_index][0]
                    faculty_id = known_face_details[best_match_index][1]
                    # attendance = known_face_details[best_match_index][2]
                    
                    if faculty_id not in faculty_id_check:
                        # flag=op.checkAttendance(faculty_id)
                        # if flag
                        op.addAttendance(faculty_id)
                        faculty_id_check.append(faculty_id)
                        
                        
                   

    
                face_names.append(name)
                face_faculty_id.append(faculty_id)
                # face_attendance.append(attendance)
               
                
                


        process_this_frame = not process_this_frame
        #print(process_this_frame)


        # Display the results
        cv2.putText(frame, "Press Q to exit" , (355,30),cv2.FONT_HERSHEY_SIMPLEX , 0.5, (255, 255, 255), 1)
        for (top, right, bottom, left), name, faculty_id in zip(face_locations, face_names, face_faculty_id):
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Draw a box around the face
            font = cv2.FONT_HERSHEY_SIMPLEX
            if name=="Unknown":
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 1)
            else:
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 1)

            # Draw a label with a name below the face
            cv2.rectangle(frame, (left, bottom+2), (right, bottom+50), (0, 0, 0), cv2.FILLED)
            
            
            cv2.putText(frame,  "name : "+name, (left + 25, bottom + 15), font, 0.5, (255, 255, 255), 1)

            cv2.putText(frame,  "fid : "+str(faculty_id), (left + 25, bottom + 37), font, 0.5, (255, 255, 255), 1)
            # cv2.putText(frame,  "days attended : "+str(int(attendance)), (left , bottom + 59), font, 0.5, (255, 255, 255), 1)

        # Display the resulting image
        
        (hgt, wid) = frame.shape[:2]
        min_dim = min(hgt, wid)
        
        # Coordinates to crop the center square
        top = (hgt - min_dim) // 2
        left = (wid - min_dim) // 2
        
        # Cropping the center square
        cropped_image = frame[top:top + min_dim, left:left + min_dim]
        cv2.imshow('Video', cropped_image)

        # Hit 'q' on the keyboard to quit!
        if cv2.waitKey(1) & 0xFF == ord('q'):

            break

    # Release handle to the webcam

    video_capture.release()
    cv2.destroyAllWindows()

#run()