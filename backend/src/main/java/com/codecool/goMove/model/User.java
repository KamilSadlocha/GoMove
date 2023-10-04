package com.codecool.goMove.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class User implements UserDetails {
    @Id
    private UUID userId = UUID.randomUUID();
    @NotBlank(message = "name is mandatory")
    private String userName;
    @NotBlank(message = "email is mandatory")
    @Email
    private String userEmail;
    @NotBlank(message = "password is mandatory")
    private String password;
    private String city;
    @Enumerated(EnumType.STRING)
    private ActivityType preferredActivity;
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_activity",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private Set<Activity> enrolledActivities;
    @Column(columnDefinition = "TEXT")
    private String description;
    @JsonIgnore
    private String photoName;
    @Transient
    private byte[] userPhoto;
    @Enumerated(EnumType.STRING)
    private Role role;

    public User(String userName, String userEmail, String password, ActivityType preferredActivity, String city) {
        this.userId = UUID.randomUUID();
        this.userName = userName;
        this.userEmail = userEmail;
        this.password = password;
        this.city = city;
        this.preferredActivity = preferredActivity;
        this.enrolledActivities = new HashSet<>();
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
