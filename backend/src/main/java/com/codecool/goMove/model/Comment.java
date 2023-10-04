package com.codecool.goMove.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Comment {
    @Id
    private UUID commentId = UUID.randomUUID();
    @NotNull(message = "date is mandatory")
    private LocalDate date;
    @NotNull(message = "time is mandatory")
    private LocalTime time;
    @NotNull(message = "user is mandatory")
    @ManyToOne
    private User user;
    @NotBlank(message = "message is mandatory")
    @Column(columnDefinition = "TEXT")
    private String message;
    @NotNull(message = "activity id is mandatory")
    private UUID activityId;

    public Comment(LocalDate date, LocalTime time, User user, String message, UUID activityId) {
        this.commentId = UUID.randomUUID();
        this.date = date;
        this.time = time;
        this.user = user;
        this.message = message;
        this.activityId = activityId;
    }
}
