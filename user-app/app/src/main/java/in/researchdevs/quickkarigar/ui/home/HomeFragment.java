package in.researchdevs.quickkarigar.ui.home;

import android.animation.LayoutTransition;
import android.animation.ObjectAnimator;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.OvershootInterpolator;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import in.researchdevs.quickkarigar.R;

import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment {

    // UI
    FrameLayout largeContainer, smallTopContainer, smallMiddleContainer;
    FrameLayout bottom1, bottom2, bottom3;

    // Data
    List<Service> serviceList = new ArrayList<>();

    private int wordIndex = 0;
    private Runnable heroRunnable;
    private TextView heroText;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // ================= HERO TEXT =================
        heroText = view.findViewById(R.id.heroText);
        startHeroAnimation();

        // ================= INIT =================
        largeContainer = view.findViewById(R.id.largeContainer);
        smallTopContainer = view.findViewById(R.id.smallTopContainer);
        smallMiddleContainer = view.findViewById(R.id.smallMiddleContainer);

        bottom1 = view.findViewById(R.id.bottom1);
        bottom2 = view.findViewById(R.id.bottom2);
        bottom3 = view.findViewById(R.id.bottom3);

        // ================= PRO LAYOUT TRANSITION =================
        ViewGroup root = (ViewGroup) view.findViewById(R.id.bottomContainer).getParent();

        LayoutTransition transition = new LayoutTransition();
        transition.enableTransitionType(LayoutTransition.CHANGING);
        transition.setDuration(250);

        root.setLayoutTransition(transition);

        // ================= DATA =================
        serviceList.add(new Service("Electrician", R.drawable.ic_user, 48, 90));
        serviceList.add(new Service("Plumber", R.drawable.ic_user, 32, 80));
        serviceList.add(new Service("Carpenter", R.drawable.ic_user, 20, 70));
        serviceList.add(new Service("Painter", R.drawable.ic_user, 15, 60));
        serviceList.add(new Service("Tutor", R.drawable.ic_user, 10, 50));
        serviceList.add(new Service("Cleaner", R.drawable.ic_user, 25, 65));
        serviceList.add(new Service("AC Repair", R.drawable.ic_user, 40, 85));
        serviceList.add(new Service("Salon", R.drawable.ic_user, 22, 55));

        renderServices();

        return view;
    }


    private void startHeroAnimation() {

        // 🔥 STEP 1: Lock width using longest word
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

            // 🔥 Entry animation
            heroText.setAlpha(0f);
            heroText.setTranslationY(30f);

            heroText.animate()
                    .alpha(1f)
                    .translationY(0f)
                    .setDuration(600)
                    .setInterpolator(new OvershootInterpolator(0.8f))
                    .start();

            // 🔥 STEP 2: Start typing AFTER layout is stable
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

    // ================= TOP 6 =================
    private List<Service> getTopServices() {

        List<Service> sorted = new ArrayList<>(serviceList);

        sorted.sort((a, b) -> b.weight - a.weight);

        if (sorted.size() > 6) {
            return sorted.subList(0, 6);
        }

        return sorted;
    }

    // ================= RENDER =================
    private void renderServices() {

        List<Service> displayList = getTopServices();
        if (displayList.size() < 6) return;

        Service selected = displayList.get(0);

        List<Service> temp = new ArrayList<>(displayList);
        temp.remove(0);

        setAnimated(largeContainer, getLargeView(selected), 0);
        setAnimated(smallTopContainer, getSmallView(temp.get(0)), 40);
        setAnimated(smallMiddleContainer, getSmallView(temp.get(1)), 80);

        setAnimated(bottom1, getMiniView(temp.get(2)), 120);
        setAnimated(bottom2, getMiniView(temp.get(3)), 160);
        setAnimated(bottom3, getSmallView(temp.get(4)), 200);
    }

    // ================= ANIMATED SET =================
    private void setAnimated(FrameLayout container, View newView, int delay) {

        container.removeAllViews();
        container.addView(newView);

        newView.setScaleX(0.8f);
        newView.setScaleY(0.8f);
        newView.setAlpha(0f);
        newView.setTranslationY(40f); // slide up effect

        newView.animate()
                .scaleX(1.05f)   // slight overshoot
                .scaleY(1.05f)
                .alpha(1f)
                .translationY(0f)
                .setStartDelay(delay)
                .setDuration(220)
                .withEndAction(() -> {
                    // settle back to normal
                    newView.animate()
                            .scaleX(1f)
                            .scaleY(1f)
                            .setDuration(120)
                            .start();
                })
                .setInterpolator(new OvershootInterpolator(1.2f))
                .start();
    }

    // ================= LARGE =================
    private View getLargeView(Service s) {

        View v = LayoutInflater.from(getContext())
                .inflate(R.layout.item_service_large, null);

        ImageView icon = v.findViewById(R.id.itemServiceIcon);
        TextView title = v.findViewById(R.id.itemServiceTitle);
        TextView subtitle = v.findViewById(R.id.itemServiceSubtitle);

        icon.setImageResource(s.icon);
        title.setText(s.name);
        subtitle.setText(s.experts + " EXPERTS");

        v.setOnClickListener(view -> onItemClick(s, view));

        return v;
    }

    // ================= SMALL =================
    private View getSmallView(Service s) {
        View v = LayoutInflater.from(getContext())
                .inflate(R.layout.item_service_small, null);

        ImageView icon = v.findViewById(R.id.itemServiceIcon);
        TextView title = v.findViewById(R.id.itemServiceTitle);

        icon.setImageResource(s.icon);
        title.setText(s.name);

        v.setOnClickListener(view -> onItemClick(s, view));

        return v;
    }

    // ================= MINI =================
    private View getMiniView(Service s) {

        View v = LayoutInflater.from(getContext())
                .inflate(R.layout.item_service_mini, null);

        ImageView icon = v.findViewById(R.id.itemServiceIcon);
        TextView title = v.findViewById(R.id.itemServiceTitle);

        icon.setImageResource(s.icon);
        title.setText(s.name.toUpperCase());

        v.setOnClickListener(view -> onItemClick(s, view));

        return v;
    }
    // ================= CLICK =================
    private void onItemClick(Service s, View clickedView) {
        // Press animation
        ObjectAnimator scaleDownX = ObjectAnimator.ofFloat(clickedView, "scaleX", 1f, 0.9f);
        ObjectAnimator scaleDownY = ObjectAnimator.ofFloat(clickedView, "scaleY", 1f, 0.9f);

        scaleDownX.setDuration(80);
        scaleDownY.setDuration(80);

        scaleDownX.start();
        scaleDownY.start();

        clickedView.postDelayed(() -> {
            int maxWeight = 0;
            // 1. Decay all services slightly
            for (Service service : serviceList) {
                service.weight *= 0.9; // reduce 10%
                maxWeight = Math.max(maxWeight, service.weight);
            }
            // 2. Boost clicked service
            int boost = Math.max(5, (int)(maxWeight * 0.1));
            s.weight = maxWeight + boost;
            // 3. Re-render
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