from connection import db

import datetime

def insert(data,name,fid):
        #print(data)
        try:
            db.sdetails.insert_one(
                {
                    "face_encodings":list(data),
                    "name":name,
                    "faculty_id":int(fid)
                    
            })
            # db.facultyAttendance.insert_one(
            #     {
            #         "faculty_id":int(fid),
            #         "attendanceDate":"",
            #         "facultyStatus":""
            # })
            #ce.addName(int(fid),name)
            return 'Inserted data successfully'
        except :
            return 'Duplicate Data'

    
def read():
    data=db.sdetails.find()
    return data
    #for i in data:
        #print(i)
def checkAttendance(fid):
    fno=db.facultyAttendance.find_one({'faculty_id':fid,'attendanceDate':datetime.datetime.now().strftime('%Y-%m-%d')})
    print(fno==None)
    return fno==None

def addAttendance(fid):
    if checkAttendance(fid):
    

        attendanceDate=datetime.datetime.now().strftime('%Y-%m-%d')
        attendanceTime=datetime.datetime.now().strftime("%H:%M:%S")
        #print(attendance)
        db.facultyAttendance.insert_one({

                'faculty_id':fid,
                'attendanceDate':attendanceDate,
                'attendanceTime':attendanceTime,
                "facultyStatus":"P" #p is present
                },
            
            )
    #ce.updateAttendance(fid,'P')

def update(fid):
    fno=db.facultyAttendance.find_one({'faculty_id':fid})

    attendance=datetime.datetime.now()
    #print(attendance)
    db.facultyAttendance.update_one({

            'faculty_id':fid
            },
            {"$set":{'attendance':attendance}
        })
    #ce.updateAttendance(fid,'P')