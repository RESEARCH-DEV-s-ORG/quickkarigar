package in.researchdevs.quickkarigar.ui.home;

public class Service {

    public int id;
    public String name;
    public String iconUrl;
    public int iconRes;
    public int experts;
    public int weight; // priority / demand

    public Service(int id, String name, String iconUrl, int iconRes, int experts, int weight) {
        this.id = id;
        this.name = name;
        this.iconUrl = iconUrl;
        this.iconRes = iconRes;
        this.experts = experts;
        this.weight = weight;
    }
}