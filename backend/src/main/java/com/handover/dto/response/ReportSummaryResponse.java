package com.handover.dto.response;

public class ReportSummaryResponse {
    private long totalHandovers;
    private long completedHandovers;
    private long pendingHandovers;
    private long rejectedHandovers;
    private double avgCompletionDays;

    public ReportSummaryResponse() {}

    public ReportSummaryResponse(long totalHandovers, long completedHandovers, long pendingHandovers, long rejectedHandovers, double avgCompletionDays) {
        this.totalHandovers = totalHandovers;
        this.completedHandovers = completedHandovers;
        this.pendingHandovers = pendingHandovers;
        this.rejectedHandovers = rejectedHandovers;
        this.avgCompletionDays = avgCompletionDays;
    }

    public long getTotalHandovers() {
        return totalHandovers;
    }

    public void setTotalHandovers(long totalHandovers) {
        this.totalHandovers = totalHandovers;
    }

    public long getCompletedHandovers() {
        return completedHandovers;
    }

    public void setCompletedHandovers(long completedHandovers) {
        this.completedHandovers = completedHandovers;
    }

    public long getPendingHandovers() {
        return pendingHandovers;
    }

    public void setPendingHandovers(long pendingHandovers) {
        this.pendingHandovers = pendingHandovers;
    }

    public long getRejectedHandovers() {
        return rejectedHandovers;
    }

    public void setRejectedHandovers(long rejectedHandovers) {
        this.rejectedHandovers = rejectedHandovers;
    }

    public double getAvgCompletionDays() {
        return avgCompletionDays;
    }

    public void setAvgCompletionDays(double avgCompletionDays) {
        this.avgCompletionDays = avgCompletionDays;
    }
}
