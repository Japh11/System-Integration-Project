import ScholarApi from "./ScholarApi";
import StaffApi from "./StaffApi";

export const fetchAllUsers = async () => {
    try {
        const role = localStorage.getItem("role");

        if (role === "SCHOLAR") {
            const staff = await StaffApi.getVisibleStaff();
            return staff.map((s) => ({ ...s, role: "STAFF" }));
        }

        if (role === "STAFF") {
            const scholars = await ScholarApi.getAllScholars();
            return scholars.map((s) => ({ ...s, role: "SCHOLAR" }));
        }

        return [];
    } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        return [];
    }
};
