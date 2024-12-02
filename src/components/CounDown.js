import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import moment from "moment";

function CountdownRow({ date, time, interval }) {
    // Use moment.js to parse date and time
    const targetDate = moment(`${date} ${time}`, "D/M/YYYY h:mm A");
    const endTime = moment(targetDate).add(interval, 'minutes');

    const [currentTime, setCurrentTime] = useState(moment());

    // Update current time periodically (e.g., every second)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Check if the current time is within the specified range
    const isWithinRange =
        currentTime.isBetween(targetDate, endTime, null, '[]');

    return (
        <div>
            {isWithinRange && (
                <div className="text-success fs-3" style={{fontWeight:'bolder'}}>
                    <Countdown date={endTime.toDate()} onComplete={() => console.log("Countdown completed")} />
                </div>
            )}
            {!isWithinRange && (
                <p className="fs-20 text-danger">Countdown has not started yet or has already passed.</p>
            )}
        </div>
    );
}


export default CountdownRow