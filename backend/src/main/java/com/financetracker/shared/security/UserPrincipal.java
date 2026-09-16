package com.financetracker.shared.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserPrincipal implements Principal {
    private final UUID id;
    private final String email;

    @Override
    public String getName() {
        return email;
    }
}
