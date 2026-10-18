package com.peopleflow.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponse<T> {
    private List<T> data;
    private PaginationMetadata pagination;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaginationMetadata {
        private long total;
        private int page;
        private int limit;
        private int totalPages;
    }
}
