package in.researchdevs.quickkarigar.ui.home;

public class Service {

    public String name;
    public int icon;
    public int experts;
    public int weight; // priority / demand

    public Service(String name, int icon, int experts, int weight) {
        this.name = name;
        this.icon = icon;
        this.experts = experts;
        this.weight = weight;
    }
}