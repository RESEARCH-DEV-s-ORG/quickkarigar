package in.researchdevs.quickkarigar.model;

public class Artisan {

    public String name;
    public String service;
    public int serviceId;
    public String distance;
    public float rating;
    public boolean isOnline;
    public String imageUrl;

    public Artisan(String name,
                   String service,
                   int serviceId,
                   String distance,
                   float rating,
                   boolean isOnline,
                   String imageUrl) {

        this.name = name;
        this.service = service;
        this.serviceId = serviceId;
        this.distance = distance;
        this.rating = rating;
        this.isOnline = isOnline;
        this.imageUrl = imageUrl;
    }
}