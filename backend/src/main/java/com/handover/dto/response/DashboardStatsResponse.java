package com.handover.dto.response;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private Map<String, Object> summary;
    private List<Map<String, Object>> departmentDistribution;
    private List<Map<String, Object>> statusDistribution;
    private List<HandoverSummaryResponse> recentHandovers;
    private List<HandoverSummaryResponse> pendingApprovalsList;
    private List<TaskResponse> incomingTasks;
    private HandoverSummaryResponse activeOutgoing;

    public DashboardStatsResponse() {}

    public Map<String, Object> getSummary() {
        return summary;
    }

    public void setSummary(Map<String, Object> summary) {
        this.summary = summary;
    }

    public List<Map<String, Object>> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(List<Map<String, Object>> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }

    public List<Map<String, Object>> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(List<Map<String, Object>> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<HandoverSummaryResponse> getRecentHandovers() {
        return recentHandovers;
    }

    public void setRecentHandovers(List<HandoverSummaryResponse> recentHandovers) {
        this.recentHandovers = recentHandovers;
    }

    public List<HandoverSummaryResponse> getPendingApprovalsList() {
        return pendingApprovalsList;
    }

    public void setPendingApprovalsList(List<HandoverSummaryResponse> pendingApprovalsList) {
        this.pendingApprovalsList = pendingApprovalsList;
    }

    public List<TaskResponse> getIncomingTasks() {
        return incomingTasks;
    }

    public void setIncomingTasks(List<TaskResponse> incomingTasks) {
        this.incomingTasks = incomingTasks;
    }

    public HandoverSummaryResponse getActiveOutgoing() {
        return activeOutgoing;
    }

    public void setActiveOutgoing(HandoverSummaryResponse activeOutgoing) {
        this.activeOutgoing = activeOutgoing;
    }
}
