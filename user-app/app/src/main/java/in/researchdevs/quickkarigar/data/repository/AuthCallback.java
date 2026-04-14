package in.researchdevs.quickkarigar.data.repository;

public interface AuthCallback {
    void onSuccess();
    void onError(String message);
}