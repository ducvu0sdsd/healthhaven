import { appointmentContext } from '@/context/AppointmentContext';
import { api } from '@/utils/api';
import { compare2Date, convertDateToDayMonthYearObject, formatVietnameseDate, generateTimes } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const Schedule = ({ day, setCurrentStep, data, hidden }) => {

    const { appointmentData } = useContext(appointmentContext)
    let times = generateTimes('08:00', '20:00', 60);
    const [timeTarget, setTimeTarget] = useState()
    const [doctorRecord, setDoctorRecord] = useState()
    useEffect(() => {
        setTimeTarget()
        setDoctorRecord(appointmentData.doctorRecord)
    }, [day])

    const checkSchedule = (time) => {
        for (let i = 0; i < doctorRecord?.schedules.length; i++) {
            const scheduleItem = doctorRecord?.schedules[i]
            const date = scheduleItem.date
            if (date.month === day.month && date.year === day.year && date.day === day.day) {
                for (let j = 0; j < scheduleItem.times.length; j++) {
                    const timeItem = scheduleItem.times[j]
                    if (timeItem.time === time) {
                        if (timeItem.status !== '') {
                            if (timeItem.status === 'health') {
                                return 3
                            } else {
                                return 2
                            }
                        } else
                            return 1
                    }
                }
            }
        }
        return 0
    }

    const handleSubmit = () => {
        if (timeTarget) {
            // data là AppointmentHome á nha
            const body = {
                ...data,
                appointment_date: {
                    day: day.day,
                    month: day.month,
                    year: day.year,
                    time: timeTarget
                }

                // Bổ sung hết hạn gì thì ở đây
            }
            // api
            api({})

            // khi then() xong thì nhớ hidden() nha (có hàm sẳn rồi)

        }
    }

    return (
        <div className='flex relative flex-col gap-3 bg-[white] rounded-md px-6 py-4 min-w-[100%]'>
            <span className='text-[17px] font-medium text-[#1c1c1c] flex items-center'><i onClick={() => setCurrentStep(1)} className='cursor-pointer bx bx-chevron-left text-[30px]'></i>{formatVietnameseDate(day)}</span>
            <span className='text-[15px] mt-4 font-medium'>Giờ Hẹn</span>
            <div className='grid grid-cols-8 gap-2 mt-2'>
                {times.map((time, index) => {
                    if (compare2Date(convertDateToDayMonthYearObject(new Date().toISOString()), day)) {
                        if (new Date().getHours() + 2 >= Number(time.split(':')[0])) {
                            // return <div key={index} className={`px-4 flex item-center justify-center py-2 transition-all border-[1px] border-[#999] text-[13px] font-medium bg-[#b7b7b7] rounded-md`}>{time}</div>
                        } else {
                            if (checkSchedule(time) === 0) {
                                return <button style={{ backgroundColor: time === timeTarget ? '#999' : 'white', color: time === timeTarget ? 'white' : 'black' }} onClick={() => setTimeTarget(time)} key={index} className={`border-[1px] border-[#999] transition-all cursor-pointer w-full h-full py-2 text-[13px] font-medium`}>{time}</button>
                            }
                        }
                    } else {
                        if (checkSchedule(time) === 0) {
                            return <button style={{ backgroundColor: time === timeTarget ? '#999' : 'white', color: time === timeTarget ? 'white' : 'black' }} onClick={() => setTimeTarget(time)} key={index} className={`border-[1px] border-[#999] rounded-xl transition-all cursor-pointer w-full h-full py-2 text-[13px] font-medium`}>{time}</button>
                        }
                    }
                })}
            </div>
            <button onClick={() => handleSubmit()} style={{ right: !timeTarget ? '-100%' : '20px' }} className='absolute right-5 bottom-5 font-space text-[14px] bg-[#1dcbb6] w-[180px] py-2 font-bold text-[white] rounded-md'>Xác Nhận Giờ Hẹn</button>
        </div>
    )
}

export default Schedule