package in.researchdevs.quickkarigar.ui.home;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import in.researchdevs.quickkarigar.R;
import in.researchdevs.quickkarigar.ui.common.pngLoader;

public class ServiceAdapter {

    public interface OnServiceClick {
        void onClick(Service service, View view);
    }

    private final LayoutInflater inflater;
    private final OnServiceClick listener;

    public ServiceAdapter(LayoutInflater inflater, OnServiceClick listener) {
        this.inflater = inflater;
        this.listener = listener;
    }

    private void loadIcon(ImageView imageView, Service s) {
        if (s.iconUrl != null && !s.iconUrl.isEmpty()) {
            pngLoader.loadImage(imageView.getContext(), s.iconUrl, imageView);
        } else {
            imageView.setImageResource(s.iconRes);
        }
    }

    public View getLargeView(ViewGroup parent, Service s) {
        View v = inflater.inflate(R.layout.item_service_large, parent, false);

        ImageView icon = v.findViewById(R.id.itemServiceIcon);
        TextView title = v.findViewById(R.id.itemServiceTitle);
        TextView subtitle = v.findViewById(R.id.itemServiceSubtitle);

        loadIcon(icon, s);
        title.setText(s.name);
        subtitle.setText(s.experts + " EXPERTS");

        v.setOnClickListener(view -> listener.onClick(s, view));

        return v;
    }

    public View getSmallView(ViewGroup parent, Service s) {
        View v = inflater.inflate(R.layout.item_service_small, parent, false);

        ImageView icon = v.findViewById(R.id.itemServiceIcon);
        TextView title = v.findViewById(R.id.itemServiceTitle);

        loadIcon(icon, s);
        title.setText(s.name);

        v.setOnClickListener(view -> listener.onClick(s, view));

        return v;
    }

    public View getMiniView(ViewGroup parent, Service s) {
        View v = inflater.inflate(R.layout.item_service_mini, parent, false);

        ImageView icon = v.findViewById(R.id.itemServiceIcon);
        TextView title = v.findViewById(R.id.itemServiceTitle);

        loadIcon(icon, s);
        title.setText(s.name.toUpperCase());

        v.setOnClickListener(view -> listener.onClick(s, view));

        return v;
    }
}