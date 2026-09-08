"use client"
import { useUser } from "@/context/UserContext";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import "./my-meetings.css";
import { useState, useEffect } from "react";
import UserMeetingCalendar from "@/components/UserMeetingCalendar/UserMeetingCalendar";
import UserMeetingList from "@/components/UserMeetingList/UserMeetingList";

const Page = () => {
  const { user } = useUser();
  const [isCalendarView, setIsCalendarView] = useState(() => {
 
    return localStorage.getItem('isCalendarView') === 'true';
  }); 

  useEffect(() => {
    localStorage.setItem('isCalendarView', isCalendarView);
  }, [isCalendarView]);
  const handleViewSwitch = () => {
    setIsCalendarView(!isCalendarView);
  };
  return (
    <div className="container">
      <InoBreadcrumb linkName="My Meetings" />
      <section id="my-meeting-section">
        <div className="my-meeting-head-section">
          <div className="row">
            <div className="col-md-6">
              <h1 className=" calendar-title text-center text-md-start ">My Meetings</h1>
            </div>
            <div className="col-md-6 d-flex justify-content-center justify-content-md-end align-items-center">
              <div className="switch-btn-container">
                <label className="switch btn-color-mode-switch">
                  <input
                    type="checkbox"
                    name="color_mode"
                    id="color_mode"
                    value="1"
                    checked={isCalendarView}
                    onChange={handleViewSwitch}
                  />
                  <label
                    htmlFor="color_mode"
                    data-on="Calendar"
                    data-off="List"
                    className="btn-color-mode-switch-inner"
                  ></label>
                </label>
              </div>
            </div>
          </div>
          <p className="mt-4" >
            Freight Talk allows you to connect with industry professionals online 24/7. You can hold instant meetings or choose to schedule them with any user. On the My Meetings page, you can view your upcoming, pending, confirmed, or completed meetings.
          </p>
        </div>
        {isCalendarView ? <UserMeetingCalendar /> : <UserMeetingList />}
      </section>
    </div>
  );
};

export default Page;
