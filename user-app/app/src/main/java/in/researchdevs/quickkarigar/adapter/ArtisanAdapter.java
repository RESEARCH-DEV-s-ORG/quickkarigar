package in.researchdevs.quickkarigar.adapter;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

import in.researchdevs.quickkarigar.R;
import in.researchdevs.quickkarigar.model.Artisan;

public class ArtisanAdapter extends RecyclerView.Adapter<ArtisanAdapter.ViewHolder> {

    private List<Artisan> list;
    private List<Artisan> originalList;
    private OnArtisanActionListener actionListener;   // add this field


    public interface OnArtisanActionListener {
        void onBookNow(Artisan artisan);   // artisan is online  → "BOOK NOW"
        void onNotifyMe(Artisan artisan);  // artisan is offline → "NOTIFY ME"
    }

    // Replace the existing constructor:
    public ArtisanAdapter(List<Artisan> list, OnArtisanActionListener listener) {
        this.list           = new ArrayList<>(list);
        this.originalList   = new ArrayList<>(list);
        this.actionListener = listener;
    }



    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_top_rated, parent, false);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int position) {

        Artisan a = list.get(position);

        // ===== TEXT =====
        h.name.setText(a.name);
        h.service.setText(a.service.toUpperCase());
        h.distance.setText(a.distance + " km");
        h.rating.setText(String.valueOf(a.rating));

        // ===== IMAGE =====
        Glide.with(h.itemView.getContext())
                .load(a.imageUrl)
                .placeholder(R.drawable.ic_user)
                .error(R.drawable.ic_user)
                .centerCrop()
                .into(h.avatar);

        // ===== STATE =====
        applyState(h, a.isOnline);

        // ===== ITEM ENTRY ANIMATION =====
        h.itemView.setAlpha(0f);
        h.itemView.setTranslationY(50f);

        h.itemView.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(300)
                .setStartDelay(position * 40) // stagger effect
                .start();

        // ===== CLICK ANIMATION =====
        h.itemView.setOnClickListener(v -> {
            v.animate()
                    .scaleX(0.95f)
                    .scaleY(0.95f)
                    .setDuration(80)
                    .withEndAction(() ->
                            v.animate()
                                    .scaleX(1f)
                                    .scaleY(1f)
                                    .setDuration(120)
                                    .start()
                    ).start();
        });

        if (h.actionBtn != null) {
            h.actionBtn.setOnClickListener(v -> {
                // micro-bounce animation
                v.animate()
                        .scaleX(0.93f).scaleY(0.93f).setDuration(80)
                        .withEndAction(() ->
                                v.animate().scaleX(1f).scaleY(1f).setDuration(120)
                                        .withEndAction(() -> {
                                            if (actionListener == null) return;
                                            if (a.isOnline) {
                                                actionListener.onBookNow(a);
                                            } else {
                                                actionListener.onNotifyMe(a);
                                            }
                                        }).start()
                        ).start();
            });
        }
    }

    @Override
    public int getItemCount() {
        return list != null ? list.size() : 0;
    }

    // ================= FILTER (SMOOTH) =================
    public void filterByService(int serviceId) {

        List<Artisan> newList = new ArrayList<>();

        if (serviceId == -1) {
            newList.addAll(originalList);
        } else {
            for (Artisan a : originalList) {
                if (a.serviceId == serviceId) {
                    newList.add(a);
                }
            }
        }

        updateList(newList);
    }

    public void filterByQuery(String query) {
        List<Artisan> newList = new ArrayList<>();
        for (Artisan a : originalList) {
            if (a.name.toLowerCase().contains(query) ||
                    a.service.toLowerCase().contains(query)) {
                newList.add(a);
            }
        }
        updateList(newList);
    }

    // ================= SMART UPDATE =================
    private void updateList(List<Artisan> newList) {

        // simple smooth refresh (better than notifyDataSetChanged)
        int oldSize = list.size();

        list.clear();
        list.addAll(newList);

        notifyItemRangeRemoved(0, oldSize);
        notifyItemRangeInserted(0, list.size());
    }

    // ================= STATE =================
    private void applyState(ViewHolder h, boolean isOnline) {

        if (isOnline) {

            h.card.setAlpha(1f);

            h.avatar.setAlpha(1f);
            if (h.onlineDot != null) h.onlineDot.setVisibility(View.VISIBLE);

            h.name.setTextColor(Color.parseColor("#111827"));
            h.service.setTextColor(Color.parseColor("#5B4DB1"));
            h.distance.setTextColor(Color.parseColor("#6B7280"));

            h.status.setText("Available");
            h.status.setTextColor(Color.parseColor("#16A34A"));

            h.rating.setTextColor(Color.parseColor("#111827"));
            h.ratingIcon.setImageTintList(
                    android.content.res.ColorStateList.valueOf(Color.parseColor("#F59E0B"))
            );

            if (h.ratingContainer != null) {
                h.ratingContainer.setBackgroundResource(R.drawable.bg_rating_pill);
            }

            if (h.actionBtn != null) {
                h.actionBtn.setText("BOOK NOW");
                h.actionBtn.setTextColor(Color.WHITE);
                h.actionBtn.setBackgroundResource(R.drawable.btn_primary_round);
            }

        } else {

            h.card.setAlpha(0.85f);

            h.avatar.setAlpha(0.6f);
            if (h.onlineDot != null) h.onlineDot.setVisibility(View.GONE);

            h.name.setTextColor(Color.parseColor("#6B7280"));
            h.service.setTextColor(Color.parseColor("#9CA3AF"));
            h.distance.setTextColor(Color.parseColor("#9CA3AF"));

            h.status.setText("Offline");
            h.status.setTextColor(Color.parseColor("#9CA3AF"));

            h.rating.setTextColor(Color.parseColor("#6B7280"));
            h.ratingIcon.setImageTintList(
                    android.content.res.ColorStateList.valueOf(Color.parseColor("#6B7280"))
            );

            if (h.ratingContainer != null) {
                h.ratingContainer.setBackgroundResource(R.drawable.bg_rating_pill_disabled);
            }

            if (h.actionBtn != null) {
                h.actionBtn.setText("NOTIFY ME");
                h.actionBtn.setTextColor(Color.parseColor("#6B7280"));
                h.actionBtn.setBackgroundResource(R.drawable.bg_btn_disabled);
            }
        }
    }

    // ================= VIEW HOLDER =================
    static class ViewHolder extends RecyclerView.ViewHolder {

        View card;
        ImageView avatar, ratingIcon;
        View onlineDot;

        TextView name, service, distance, status, rating;
        View ratingContainer;
        TextView actionBtn;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            card = itemView.findViewById(R.id.cardRoot);
            avatar = itemView.findViewById(R.id.avatar);
            onlineDot = itemView.findViewById(R.id.onlineDot);

            name = itemView.findViewById(R.id.name);
            service = itemView.findViewById(R.id.service);
            distance = itemView.findViewById(R.id.distance);
            status = itemView.findViewById(R.id.status);
            rating = itemView.findViewById(R.id.rating);
            ratingIcon = itemView.findViewById(R.id.ratingIcon);

            ratingContainer = itemView.findViewById(R.id.ratingContainer);
            actionBtn = itemView.findViewById(R.id.actionBtn);
        }
    }
}