package in.researchdevs.quickkarigar.model;

public class ServiceType {
    public int    id;
    public String label;       // e.g. "Internal Wiring"
    public int    basePrice;   // e.g. 749  (in ₹)
    public String iconRes;     // drawable name, optional for future use

    public ServiceType(int id, String label, int basePrice) {
        this.id        = id;
        this.label     = label;
        this.basePrice = basePrice;
    }
}