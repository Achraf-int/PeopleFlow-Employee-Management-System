package com.peopleflow.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EmploymentStatus {
    ACTIVE("Active"),
    ON_LEAVE("On Leave"),
    INACTIVE("Inactive");

    private final String label;

    EmploymentStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static EmploymentStatus fromString(String text) {
        if (text == null) return null;
        for (EmploymentStatus status : EmploymentStatus.values()) {
            if (status.label.equalsIgnoreCase(text) || status.name().equalsIgnoreCase(text)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown employment status: " + text);
    }
}
