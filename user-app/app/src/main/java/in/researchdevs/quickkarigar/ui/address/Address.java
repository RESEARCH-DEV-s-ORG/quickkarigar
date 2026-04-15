package in.researchdevs.quickkarigar.ui.address;
public class Address {
    public int id;
    public String title;
    public String fullAddress;
    public boolean isDefault;
    public int iconRes;

    public Address(int id, String title, String fullAddress, boolean isDefault, int iconRes) {
        this.id = id;
        this.title = title;
        this.fullAddress = fullAddress;
        this.isDefault = isDefault;
        this.iconRes = iconRes;
    }
}