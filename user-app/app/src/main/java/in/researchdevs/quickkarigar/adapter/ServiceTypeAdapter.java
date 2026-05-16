package in.researchdevs.quickkarigar.adapter;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import in.researchdevs.quickkarigar.R;
import in.researchdevs.quickkarigar.model.ServiceType;

public class ServiceTypeAdapter extends RecyclerView.Adapter<ServiceTypeAdapter.VH> {

    public interface OnServiceSelected {
        void onSelected(ServiceType serviceType);
    }

    private final List<ServiceType>  items;
    private       int                selectedPos = 0;
    private final OnServiceSelected  listener;

    // ── colours ──────────────────────────────────────────────────────────────
    private static final int COLOR_SELECTED_BG   = Color.parseColor("#1A237E");
    private static final int COLOR_SELECTED_TEXT = Color.WHITE;
    private static final int COLOR_NORMAL_BG     = Color.parseColor("#F3F4F6");
    private static final int COLOR_NORMAL_TEXT   = Color.parseColor("#374151");
    private static final int COLOR_TAG_SEL       = Color.parseColor("#C7D2FE");
    private static final int COLOR_TAG_NORM      = Color.parseColor("#5B4DB1");
    private static final int COLOR_TAG_BG_SEL    = Color.parseColor("#283593");
    private static final int COLOR_TAG_BG_NORM   = Color.parseColor("#EAE8F8");

    public ServiceTypeAdapter(List<ServiceType> items, OnServiceSelected listener) {
        this.items    = items;
        this.listener = listener;
    }

    // ── pre-select by serviceId ───────────────────────────────────────────────
    public void selectById(int serviceId) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).id == serviceId) {
                int old = selectedPos;
                selectedPos = i;
                notifyItemChanged(old);
                notifyItemChanged(selectedPos);
                break;
            }
        }
    }

    public ServiceType getSelected() {
        return items.get(selectedPos);
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_service_chip, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH h, int pos) {
        ServiceType item     = items.get(pos);
        boolean     selected = pos == selectedPos;

        h.tvLabel.setText(item.label);
        h.tvPrice.setText("₹" + item.basePrice);

        if (selected) {
            h.root.setBackgroundTintList(ColorStateList.valueOf(COLOR_SELECTED_BG));
            h.tvLabel.setTextColor(COLOR_SELECTED_TEXT);
            h.tvPrice.setTextColor(COLOR_TAG_SEL);
            h.tvPrice.setBackgroundTintList(ColorStateList.valueOf(COLOR_TAG_BG_SEL));
        } else {
            h.root.setBackgroundTintList(ColorStateList.valueOf(COLOR_NORMAL_BG));
            h.tvLabel.setTextColor(COLOR_NORMAL_TEXT);
            h.tvPrice.setTextColor(COLOR_TAG_NORM);
            h.tvPrice.setBackgroundTintList(ColorStateList.valueOf(COLOR_TAG_BG_NORM));
        }

        h.root.setOnClickListener(v -> {
            if (selectedPos == h.getAdapterPosition()) return;
            int old = selectedPos;
            selectedPos = h.getAdapterPosition();
            notifyItemChanged(old);
            notifyItemChanged(selectedPos);

            // bounce
            v.animate().scaleX(0.93f).scaleY(0.93f).setDuration(70)
                    .withEndAction(() ->
                            v.animate().scaleX(1f).scaleY(1f).setDuration(110).start()
                    ).start();

            listener.onSelected(items.get(selectedPos));
        });
    }

    @Override
    public int getItemCount() { return items.size(); }

    static class VH extends RecyclerView.ViewHolder {
        View     root;
        TextView tvLabel, tvPrice;
        VH(@NonNull View v) {
            super(v);
            root    = v.findViewById(R.id.chipRoot);
            tvLabel = v.findViewById(R.id.tvChipLabel);
            tvPrice = v.findViewById(R.id.tvChipPrice);
        }
    }
}