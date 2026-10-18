package com.peopleflow.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EmploymentType {
    FULL_TIME("Full-time"),
    PART_TIME("Part-time"),
    CONTRACT("Contract"),
    INTERN("Intern");

    private final String label;

    EmploymentType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static EmploymentType fromString(String text) {
        if (text == null) return null;
        for (EmploymentType type : EmploymentType.values()) {
            if (type.label.equalsIgnoreCase(text) || type.name().equalsIgnoreCase(text)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown employment type: " + text);
    }
}
