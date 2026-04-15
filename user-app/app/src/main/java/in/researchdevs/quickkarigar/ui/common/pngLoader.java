package in.researchdevs.quickkarigar.ui.common;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.widget.ImageView;

import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomViewTarget;
import com.bumptech.glide.request.transition.Transition;

import in.researchdevs.quickkarigar.R;

public class pngLoader {

    // Now works for PNG / JPG / WEBP (no SVG)
    public static void loadImage(Context context, String url, ImageView imageView) {

        // fallback if empty
        if (url == null || url.trim().isEmpty()) {
            imageView.setImageResource(R.drawable.ic_placeholder);
            return;
        }

        // reset
        imageView.setImageDrawable(null);

        Glide.with(context)
                .load(url)
                .placeholder(R.drawable.ic_placeholder)
                .error(R.drawable.ic_placeholder)
                .into(new CustomViewTarget<ImageView, Drawable>(imageView) {

                    @Override
                    protected void onResourceCleared(@Nullable Drawable placeholder) {
                        imageView.setImageDrawable(placeholder);
                    }

                    @Override
                    public void onLoadFailed(@Nullable Drawable errorDrawable) {
                        imageView.setImageDrawable(errorDrawable);
                    }

                    @Override
                    public void onResourceReady(Drawable resource,
                                                Transition<? super Drawable> transition) {
                        imageView.setImageDrawable(resource);
                        // smooth fade
                        imageView.setAlpha(0f);
                        imageView.animate().alpha(1f).setDuration(200).start();
                    }
                });
    }
}