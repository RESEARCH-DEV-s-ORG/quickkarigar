package in.researchdevs.quickkarigar.utility;

import android.text.TextPaint;
import android.text.style.ClickableSpan;
public abstract class PressableClickableSpan extends ClickableSpan {

    private boolean isPressed = false;
    private int normalColor;
    private int pressedColor;

    public PressableClickableSpan(int normalColor, int pressedColor) {
        this.normalColor = normalColor;
        this.pressedColor = pressedColor;
    }

    public void setPressed(boolean pressed) {
        isPressed = pressed;
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        ds.setColor(isPressed ? pressedColor : normalColor);
        ds.setUnderlineText(false);
    }
}
