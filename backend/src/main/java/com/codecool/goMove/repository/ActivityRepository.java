package com.codecool.goMove.repository;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByDateAfter(LocalDate date);

    List<Activity> findByActivityType(ActivityType activityType);

    List<Activity> findByCity(String city);

    List<Activity> findByActivityTypeAndCity(ActivityType activityType, String city);

    @Query("SELECT a FROM Activity a WHERE a.owner.userId = :ownerId AND a.date >= CURRENT DATE")
    List<Activity> findByOwnerId(UUID ownerId);

    @Query("SELECT a FROM Activity a WHERE :userUuid IN (SELECT u.userId FROM a.participants u) AND a.date >= CURRENT DATE")
    List<Activity> getActivitiesByParticipantId(UUID userUuid);

    @Query("SELECT DISTINCT a.city FROM Activity a WHERE a.date >= CURRENT DATE")
    List<String> getAllCities();
}