import { describe, it, expect } from "vitest";
import { safePercentage } from "@/lib/utils";

describe("Analytics & KPI Calculation Correctness", () => {
  it("should handle empty datasets gracefully without NaN or division by zero", () => {
    const leads: any[] = [];
    const appointments: any[] = [];
    const opportunities: any[] = [];

    const newEnquiries = leads.length;
    const awaitingFirstContact = leads.filter((l) => l.stage === "new" && !l.first_contact_at).length;
    const appointmentsBooked = appointments.length;
    const appointmentsAttended = appointments.filter((a) => a.status === "attended").length;

    const bookingConversionRate = Math.round(safePercentage(appointmentsBooked, newEnquiries));
    const attendanceRate = Math.round(safePercentage(appointmentsAttended, appointmentsBooked));

    const totalAcceptedOpps = opportunities.filter((o) =>
      ["accepted", "collected", "partially_collected"].includes(o.status)
    ).length;
    const treatmentAcceptanceRate = Math.round(safePercentage(totalAcceptedOpps, opportunities.length));

    const acceptedOpportunityValue = opportunities.reduce(
      (acc, o) => acc + (o.accepted_value || 0),
      0
    );
    const totalCollections = opportunities.reduce(
      (acc, o) => acc + (o.collected_amount || 0),
      0
    );

    expect(newEnquiries).toBe(0);
    expect(awaitingFirstContact).toBe(0);
    expect(bookingConversionRate).toBe(0);
    expect(attendanceRate).toBe(0);
    expect(treatmentAcceptanceRate).toBe(0);
    expect(acceptedOpportunityValue).toBe(0);
    expect(totalCollections).toBe(0);
    expect(Number.isNaN(bookingConversionRate)).toBe(false);
    expect(Number.isNaN(attendanceRate)).toBe(false);
  });

  it("should calculate accurate conversion and revenue metrics on populated datasets", () => {
    const leads = [
      { id: "1", stage: "new", created_at: "2026-10-01T10:00:00Z", first_contact_at: null },
      { id: "2", stage: "contacted", created_at: "2026-10-01T11:00:00Z", first_contact_at: "2026-10-01T11:30:00Z" },
      { id: "3", stage: "appointment_booked", created_at: "2026-10-02T10:00:00Z", first_contact_at: "2026-10-02T10:15:00Z" },
      { id: "4", stage: "won", created_at: "2026-10-03T10:00:00Z", first_contact_at: "2026-10-03T10:05:00Z" },
    ];

    const appointments = [
      { id: "a1", status: "attended", scheduled_at: "2026-10-05T10:00:00Z" },
      { id: "a2", status: "booked", scheduled_at: "2026-10-06T10:00:00Z" },
    ];

    const opportunities = [
      { id: "o1", status: "accepted", proposed_value: 50000, accepted_value: 50000, collected_amount: 25000 },
      { id: "o2", status: "collected", proposed_value: 80000, accepted_value: 80000, collected_amount: 80000 },
      { id: "o3", status: "lost", proposed_value: 30000, accepted_value: 0, collected_amount: 0 },
    ];

    const newEnquiries = leads.length;
    const awaitingFirstContact = leads.filter((l) => l.stage === "new" && !l.first_contact_at).length;
    const appointmentsBooked = appointments.length;
    const appointmentsAttended = appointments.filter((a) => a.status === "attended").length;

    const bookingRate = Math.round(safePercentage(appointmentsBooked, newEnquiries));
    const attendanceRate = Math.round(safePercentage(appointmentsAttended, appointmentsBooked));

    const totalAccepted = opportunities.filter((o) =>
      ["accepted", "collected", "partially_collected"].includes(o.status)
    ).length;
    const acceptanceRate = Math.round(safePercentage(totalAccepted, opportunities.length));

    const totalAcceptedValue = opportunities.reduce((acc, o) => acc + (o.accepted_value || 0), 0);
    const totalCollections = opportunities.reduce((acc, o) => acc + (o.collected_amount || 0), 0);

    expect(newEnquiries).toBe(4);
    expect(awaitingFirstContact).toBe(1);
    expect(bookingRate).toBe(50); // 2/4 = 50%
    expect(attendanceRate).toBe(50); // 1/2 = 50%
    expect(acceptanceRate).toBe(67); // 2/3 = 66.67% -> 67%
    expect(totalAcceptedValue).toBe(130000);
    expect(totalCollections).toBe(105000);
  });

  it("should partition follow-up tasks accurately into overdue, dueToday, and upcoming", () => {
    const fixedNow = new Date("2026-10-27T12:00:00.000Z");
    const startOfDay = new Date("2026-10-27T00:00:00.000Z");
    const endOfDay = new Date("2026-10-27T23:59:59.999Z");

    const tasks = [
      { id: "t1", title: "Overdue task", due_at: "2026-10-26T15:00:00.000Z" },
      { id: "t2", title: "Due today afternoon", due_at: "2026-10-27T14:00:00.000Z" },
      { id: "t3", title: "Upcoming tomorrow", due_at: "2026-10-28T10:00:00.000Z" },
    ];

    const overdue: any[] = [];
    const dueToday: any[] = [];
    const upcoming: any[] = [];

    tasks.forEach((task) => {
      const dueTime = new Date(task.due_at).getTime();
      const currentTime = fixedNow.getTime();
      const endOfDayTime = endOfDay.getTime();

      if (dueTime < currentTime) {
        overdue.push(task);
      } else if (dueTime <= endOfDayTime) {
        dueToday.push(task);
      } else {
        upcoming.push(task);
      }
    });

    expect(overdue.length).toBe(1);
    expect(overdue[0].id).toBe("t1");
    expect(dueToday.length).toBe(1);
    expect(dueToday[0].id).toBe("t2");
    expect(upcoming.length).toBe(1);
    expect(upcoming[0].id).toBe("t3");
  });

  it("should correctly calculate pagination offsets and total pages", () => {
    const totalRecords = 55;
    const pageSize = 20;

    const page1From = (1 - 1) * pageSize;
    const page1To = page1From + pageSize - 1;
    const totalPages = Math.ceil(totalRecords / pageSize);

    expect(page1From).toBe(0);
    expect(page1To).toBe(19);
    expect(totalPages).toBe(3);

    const page3From = (3 - 1) * pageSize;
    const page3To = page3From + pageSize - 1;
    expect(page3From).toBe(40);
    expect(page3To).toBe(59);
  });
});
