package com.Capstone.IskoLAIR.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

@Component
public class JWTUtil {

    @Value("${jwt_secret}")
    private String secret;

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // Token valid for 24 hours

    // Generate token with the role prefixed by "ROLE_"
    public String generateToken(String email, String role) {
        return JWT.create()
            .withSubject("User Details")
            .withClaim("email", email)
            .withClaim("role", "ROLE_" + role) // Don't forget the "ROLE_" prefix!
            .withIssuedAt(new Date())
            .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .withIssuer("YOUR APPLICATION/PROJECT/COMPANY NAME")
            .sign(Algorithm.HMAC256(secret));
    }


    // Validate the token and retrieve the subject (email)
    public String validateTokenAndRetrieveSubject(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("YOUR APPLICATION/PROJECT/COMPANY NAME")
                .build();
        DecodedJWT jwt = verifier.verify(token);
        if (jwt.getExpiresAt().before(new Date())) {
            throw new JWTVerificationException("Token has expired");
        }
        return jwt.getClaim("email").asString();  // Extract email from JWT
    }

    // Validate the token and retrieve the role
    public String validateTokenAndRetrieveRole(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("YOUR APPLICATION/PROJECT/COMPANY NAME")
                .build();
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaim("role").asString();  // Extract role from JWT
    }
}
