import face_recognition
import cv2
import operations as op


def run(name,faculty_id):
    key = cv2. waitKey(1)
    webcam = cv2.VideoCapture(0)
    #sleep(2)
    while True:
    
        check, frame = webcam.read()
        key = cv2.waitKey(1)
    
        (hgt, wid) = frame.shape[:2]

        cv2.putText(frame,  "Press S to take picture", ( 220, 20),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame,  "Press E to exit", ( 250, 45),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.rectangle(frame, ((wid // 2) - hgt // 2, 0), ((wid // 2) + hgt // 2, hgt), (0, 255, 0), 1)
        cv2.imshow('Capturing' , frame)
        if key == ord('s'):

            min_dim = min(hgt, wid)
            
            # Coordinates to crop the center square
            top = (hgt - min_dim) // 2
            left = (wid - min_dim) // 2
            
            # Cropping the center square
            cropped_image = frame[top:top + min_dim, left:left + min_dim]
            cv2.imwrite(filename='saved_img.jpg', img=cropped_image)
            webcam.release()
            
            message=insertS(name,faculty_id)
            
            #print(message)
            if message=='Inserted data successfully':
                webcam.release()
                cv2.destroyAllWindows()
                return 'Record added succesfully'
            else:
                webcam.release()
                cv2.destroyAllWindows()
                return "Record already exist"
            break
        elif key == ord('e'):
            webcam.release()
            cv2.destroyAllWindows()
            break

def insertS(name,faculty_id):
    new_image = face_recognition.load_image_file("saved_img.jpg")
    new_face_encoding = face_recognition.face_encodings(new_image)[0]
    message=op.insert(new_face_encoding,name, faculty_id)
    return message