package in.researchdevs.quickkarigar.ui.address;

public class Address {

    public int id;

    public String title;
    public String fullAddress;
    public int iconRes;

    public String house;
    public String area;
    public String city;
    public String pincode;

    public boolean isDefault;

    public Address(int id,
                   String house,
                   String area,
                   String city,
                   String pincode,
                   boolean isDefault,
                   int iconRes) {

        this.id = id;

        this.house = house;
        this.area = area;
        this.city = city;
        this.pincode = pincode;
        this.isDefault = isDefault;
        this.iconRes = iconRes;

        updateDerivedFields(); // always keep sync
    }

    public void updateDerivedFields() {
        this.title = house;
        this.fullAddress = area + ", " + city + " - " + pincode;
    }
}