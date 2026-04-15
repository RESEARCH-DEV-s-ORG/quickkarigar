package in.researchdevs.quickkarigar.ui.home;

import android.animation.LayoutTransition;
import android.animation.ObjectAnimator;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.OvershootInterpolator;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.TextView;

import in.researchdevs.quickkarigar.R;
import in.researchdevs.quickkarigar.adapter.ArtisanAdapter;
import in.researchdevs.quickkarigar.model.Artisan;

import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment {

    FrameLayout largeContainer, smallTopContainer, smallMiddleContainer;
    FrameLayout bottom1, bottom2, bottom3;

    List<Service> serviceList = new ArrayList<>();

    private int wordIndex = 0;
    private Runnable heroRunnable;
    private TextView heroText;

    RecyclerView recyclerArtisans;
    List<Artisan> artisanList = new ArrayList<>();
    List<Artisan> fullArtisanList = new ArrayList<>();

    ArtisanAdapter adapter;
    ServiceAdapter serviceAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // ================= HERO =================
        heroText = view.findViewById(R.id.heroText);
        startHeroAnimation();

        // ================= SEARCH =================
        EditText searchInput = view.findViewById(R.id.searchInput);
        searchInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void afterTextChanged(android.text.Editable s) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                handleSearch(s.toString().trim().toLowerCase());
            }
        });

        // ================= INIT =================
        largeContainer = view.findViewById(R.id.largeContainer);
        smallTopContainer = view.findViewById(R.id.smallTopContainer);
        smallMiddleContainer = view.findViewById(R.id.smallMiddleContainer);

        bottom1 = view.findViewById(R.id.bottom1);
        bottom2 = view.findViewById(R.id.bottom2);
        bottom3 = view.findViewById(R.id.bottom3);

        // ================= TRANSITION =================
        ViewGroup root = (ViewGroup) view.findViewById(R.id.bottomContainer).getParent();
        LayoutTransition transition = new LayoutTransition();
        transition.enableTransitionType(LayoutTransition.CHANGING);
        transition.setDuration(250);
        root.setLayoutTransition(transition);

        // ================= SERVICE ADAPTER =================
        serviceAdapter = new ServiceAdapter(LayoutInflater.from(getContext()), (service, clickedView) -> {
            onItemClick(service, clickedView);
            adapter.filterByService(service.id);
        });

        // ================= SERVICES =================
        serviceList.add(new Service(101,"Electrician", "https://quickkargiar.netlify.app/icons/electrician.png", R.drawable.ic_user, 48, 90));
        serviceList.add(new Service(102,"Plumber", "https://quickkargiar.netlify.app/icons/plumber.png", R.drawable.ic_user, 32, 80));
        serviceList.add(new Service(103,"Carpenter", "https://quickkargiar.netlify.app/icons/carpenter.png", R.drawable.ic_user, 20, 70));
        serviceList.add(new Service(104,"Painter", "https://quickkargiar.netlify.app/icons/painter.png", R.drawable.ic_user, 15, 60));
        serviceList.add(new Service(105,"Tutor", null, R.drawable.ic_user, 10, 50));
        serviceList.add(new Service(106,"Cleaner", "https://quickkargiar.netlify.app/icons/cleaner.png", R.drawable.ic_user, 25, 65));
        serviceList.add(new Service(107,"AC Repair", "https://quickkargiar.netlify.app/icons/ac-repair.png", R.drawable.ic_user, 40, 85));
        serviceList.add(new Service(108,"Salon", null, R.drawable.ic_user, 22, 55));

        serviceList.add(new Service(109,"Computer Technician", null, R.drawable.ic_user, 14, 40));
        serviceList.add(new Service(110,"Network Engineer", null, R.drawable.ic_user, 8, 35));
        serviceList.add(new Service(111,"CCTV Installer", null, R.drawable.ic_user, 12, 38));
        serviceList.add(new Service(112,"RO Water Purifier Service", null, R.drawable.ic_user, 16, 42));
        serviceList.add(new Service(113,"Washing Machine Repair", null, R.drawable.ic_user, 13, 41));
        serviceList.add(new Service(114,"Refrigerator Repair", null, R.drawable.ic_user, 11, 39));
        serviceList.add(new Service(115,"Interior Designer", null, R.drawable.ic_user, 7, 30));
        serviceList.add(new Service(116,"Pest Control Expert", null, R.drawable.ic_user, 10, 34));
        serviceList.add(new Service(117,"Solar Panel Technician", null, R.drawable.ic_user, 6, 28));
        serviceList.add(new Service(118,"Home Automation Expert", null, R.drawable.ic_user, 5, 25));

        renderServices();

        // ================= ARTISANS =================
        recyclerArtisans = view.findViewById(R.id.topRatedRecycler);
        recyclerArtisans.setLayoutManager(new LinearLayoutManager(getContext()));

        seedArtisans();

        adapter = new ArtisanAdapter(fullArtisanList);
        recyclerArtisans.setAdapter(adapter);

        Service topService = getTopServices().get(0);
        adapter.filterByService(topService.id);

        return view;
    }

    // ================= SEARCH =================
    private void handleSearch(String query) {
        if (query.isEmpty()) {
            renderServices();
            Service topService = getTopServices().get(0);
            adapter.filterByService(topService.id);
            return;
        }

        List<Service> filteredServices = new ArrayList<>();
        for (Service s : serviceList) {
            if (s.name.toLowerCase().contains(query)) {
                filteredServices.add(s);
            }
        }

        if (!filteredServices.isEmpty()) {
            Service matched = filteredServices.get(0);

            List<Service> displayList = new ArrayList<>();
            displayList.add(matched);

            for (Service s : serviceList) {
                if (s.id != matched.id && displayList.size() < 6) {
                    displayList.add(s);
                }
            }

            renderServicesWithList(displayList);
            adapter.filterByService(matched.id);
            return;
        }

        adapter.filterByQuery(query);
    }

    // ================= SERVICES RENDER =================
    private void renderServices() {
        List<Service> displayList = getTopServices();
        if (displayList.size() < 6) return;

        Service selected = displayList.get(0);
        List<Service> temp = new ArrayList<>(displayList);
        temp.remove(0);

        setAnimated(largeContainer, serviceAdapter.getLargeView(largeContainer, selected), 0);
        setAnimated(smallTopContainer, serviceAdapter.getSmallView(smallTopContainer, temp.get(0)), 40);
        setAnimated(smallMiddleContainer, serviceAdapter.getSmallView(smallMiddleContainer, temp.get(1)), 80);

        setAnimated(bottom1, serviceAdapter.getMiniView(bottom1, temp.get(2)), 120);
        setAnimated(bottom2, serviceAdapter.getMiniView(bottom2, temp.get(3)), 160);
        setAnimated(bottom3, serviceAdapter.getSmallView(bottom3, temp.get(4)), 200);
    }

    private void renderServicesWithList(List<Service> displayList) {
        if (displayList.size() < 6) return;

        Service selected = displayList.get(0);
        List<Service> temp = new ArrayList<>(displayList);
        temp.remove(0);

        setAnimated(largeContainer, serviceAdapter.getLargeView(largeContainer, selected), 0);
        setAnimated(smallTopContainer, serviceAdapter.getSmallView(smallTopContainer, temp.get(0)), 40);
        setAnimated(smallMiddleContainer, serviceAdapter.getSmallView(smallMiddleContainer, temp.get(1)), 80);

        setAnimated(bottom1, serviceAdapter.getMiniView(bottom1, temp.get(2)), 120);
        setAnimated(bottom2, serviceAdapter.getMiniView(bottom2, temp.get(3)), 160);
        setAnimated(bottom3, serviceAdapter.getSmallView(bottom3, temp.get(4)), 200);
    }

    // ================= DATA =================
    private void seedArtisans() {
        fullArtisanList.clear();

        // ===== ELECTRICIANS =====
        fullArtisanList.add(new Artisan("Rahul Sharma","Electrician",101,"1.2",4.9f,true,"https://randomuser.me/api/portraits/men/1.jpg"));
        fullArtisanList.add(new Artisan("Arjun Mehta","Electrician",101,"0.9",4.7f,true,"https://randomuser.me/api/portraits/men/5.jpg"));
        fullArtisanList.add(new Artisan("Suresh Yadav","Electrician",101,"2.1",4.5f,false,"https://randomuser.me/api/portraits/men/6.jpg"));

        // ===== PLUMBERS =====
        fullArtisanList.add(new Artisan("Vikram Singh","Plumber",102,"2.5",4.8f,true,"https://randomuser.me/api/portraits/men/2.jpg"));
        fullArtisanList.add(new Artisan("Ramesh Gupta","Plumber",102,"1.8",4.6f,true,"https://randomuser.me/api/portraits/men/7.jpg"));
        fullArtisanList.add(new Artisan("Deepak Chauhan","Plumber",102,"3.0",4.3f,false,"https://randomuser.me/api/portraits/men/8.jpg"));

        // ===== CARPENTERS =====
        fullArtisanList.add(new Artisan("Amit Kumar","Carpenter",103,"0.8",5.0f,false,"https://randomuser.me/api/portraits/men/3.jpg"));
        fullArtisanList.add(new Artisan("Nitin Verma","Carpenter",103,"1.5",4.8f,true,"https://randomuser.me/api/portraits/men/9.jpg"));
        fullArtisanList.add(new Artisan("Karan Malhotra","Carpenter",103,"2.7",4.4f,true,"https://randomuser.me/api/portraits/men/10.jpg"));

        // ===== PAINTERS =====
        fullArtisanList.add(new Artisan("Rohit Verma","Painter",104,"3.1",4.7f,true,"https://randomuser.me/api/portraits/men/4.jpg"));
        fullArtisanList.add(new Artisan("Imran Khan","Painter",104,"1.9",4.6f,false,"https://randomuser.me/api/portraits/men/11.jpg"));
        fullArtisanList.add(new Artisan("Faizal Sheikh","Painter",104,"2.3",4.5f,true,"https://randomuser.me/api/portraits/men/12.jpg"));

        // ===== CLEANERS =====
        fullArtisanList.add(new Artisan("Sunil Patil","Cleaner",106,"1.0",4.9f,true,"https://randomuser.me/api/portraits/men/13.jpg"));
        fullArtisanList.add(new Artisan("Mahesh Pawar","Cleaner",106,"2.2",4.4f,false,"https://randomuser.me/api/portraits/men/14.jpg"));

        // ===== AC REPAIR =====
        fullArtisanList.add(new Artisan("Ravi Joshi","AC Repair",107,"1.3",4.8f,true,"https://randomuser.me/api/portraits/men/15.jpg"));
        fullArtisanList.add(new Artisan("Sameer Ali","AC Repair",107,"2.6",4.6f,true,"https://randomuser.me/api/portraits/men/16.jpg"));
        fullArtisanList.add(new Artisan("Javed Khan","AC Repair",107,"3.4",4.2f,false,"https://randomuser.me/api/portraits/men/17.jpg"));

        // ===== SALON =====
        fullArtisanList.add(new Artisan("Aman Hair","Salon",108,"0.5",4.9f,true,"https://randomuser.me/api/portraits/men/18.jpg"));
        fullArtisanList.add(new Artisan("Raj Stylist","Salon",108,"1.1",4.7f,true,"https://randomuser.me/api/portraits/men/19.jpg"));

        // ===== TUTOR =====
        fullArtisanList.add(new Artisan("Neeraj Sir","Tutor",105,"2.0",4.8f,true,"https://randomuser.me/api/portraits/men/20.jpg"));
        fullArtisanList.add(new Artisan("Pooja Ma'am","Tutor",105,"1.4",4.9f,true,"https://randomuser.me/api/portraits/women/1.jpg"));

        // ===== COPY TO DISPLAY LIST =====
        artisanList.clear();
        artisanList.addAll(fullArtisanList);
    }

    // ================= HERO =================
    private void startHeroAnimation() {
        //STEP 1: Lock width using longest word
        heroText.post(() -> {
            String longest = "";
            for (Service s : serviceList) {
                if (s.name.length() > longest.length()) {
                    longest = s.name;
                }
            }
            String full = "Find the perfect " + longest + " for your home.";
            SpannableString spannable = new SpannableString(full);
            int start = full.indexOf(longest);
            int end = start + longest.length();
            spannable.setSpan(
                    new ForegroundColorSpan(Color.parseColor("#5B4DB1")),
                    start, end,
                    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
            );
            spannable.setSpan(
                    new StyleSpan(Typeface.BOLD),
                    start, end,
                    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
            );
            heroText.setText(spannable);

            // lock width after layout
            heroText.setMinWidth(heroText.getWidth());

            // Entry animation
            heroText.setAlpha(0f);
            heroText.setTranslationY(30f);

            heroText.animate()
                    .alpha(1f)
                    .translationY(0f)
                    .setDuration(600)
                    .setInterpolator(new OvershootInterpolator(0.8f))
                    .start();

            // STEP 2: Start typing AFTER layout is stable
            heroRunnable = new Runnable() {

                int charIndex = 0;
                boolean isDeleting = false;
                String currentWord = "";

                @Override
                public void run() {

                    List<Service> top = getTopServices();
                    if (top.isEmpty()) return;

                    // Pick new word
                    if (!isDeleting && charIndex == 0) {
                        Service s = top.get(wordIndex % top.size());
                        currentWord = s.name;
                        wordIndex++;
                    }

                    // Typing / deleting
                    if (isDeleting) {
                        charIndex--;
                    } else {
                        charIndex++;
                    }

                    String visibleWord = currentWord.substring(0, charIndex);

                    String fullText = "Find the perfect " + visibleWord + " for your home.";
                    SpannableString spannable = new SpannableString(fullText);

                    int start = fullText.indexOf(visibleWord);
                    int end = start + visibleWord.length();

                    if (visibleWord.length() > 0) {
                        spannable.setSpan(
                                new ForegroundColorSpan(Color.parseColor("#5B4DB1")),
                                start, end,
                                Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                        );

                        spannable.setSpan(
                                new StyleSpan(Typeface.BOLD),
                                start, end,
                                Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                        );
                    }
                    heroText.setText(spannable);
                    if (!isDeleting && charIndex == currentWord.length()) {
                        isDeleting = true;
                        heroText.postDelayed(this, 10000);
                        return;
                    }

                    if (isDeleting && charIndex == 0) {
                        isDeleting = false;
                        heroText.postDelayed(this, 500);
                        return;
                    }

                    long delay = isDeleting
                            ? 50
                            : 100 + (long)(Math.random() * 60);

                    heroText.postDelayed(this, delay);
                }
            };

            heroText.postDelayed(heroRunnable, 900);
        });
    }

    // ================= UTIL =================
    private List<Service> getTopServices() {
        List<Service> sorted = new ArrayList<>(serviceList);
        sorted.sort((a, b) -> b.weight - a.weight);
        return sorted.size() > 6 ? sorted.subList(0, 6) : sorted;
    }

    private void setAnimated(FrameLayout container, View newView, int delay) {
        container.removeAllViews();
        container.addView(newView);

        newView.setScaleX(0.8f);
        newView.setScaleY(0.8f);
        newView.setAlpha(0f);
        newView.setTranslationY(40f);

        newView.animate()
                .scaleX(1.05f)
                .scaleY(1.05f)
                .alpha(1f)
                .translationY(0f)
                .setStartDelay(delay)
                .setDuration(220)
                .withEndAction(() ->
                        newView.animate().scaleX(1f).scaleY(1f).setDuration(120).start()
                )
                .setInterpolator(new OvershootInterpolator(1.2f))
                .start();
    }

    private void onItemClick(Service s, View clickedView) {

        ObjectAnimator.ofFloat(clickedView, "scaleX", 1f, 0.9f).setDuration(80).start();
        ObjectAnimator.ofFloat(clickedView, "scaleY", 1f, 0.9f).setDuration(80).start();

        clickedView.postDelayed(() -> {

            int maxWeight = 0;

            for (Service service : serviceList) {
                service.weight *= 0.9;
                maxWeight = Math.max(maxWeight, service.weight);
            }

            int boost = Math.max(5, (int)(maxWeight * 0.1));
            s.weight = maxWeight + boost;

            renderServices();

        }, 100);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (heroText != null && heroRunnable != null) {
            heroText.removeCallbacks(heroRunnable);
        }
    }
}