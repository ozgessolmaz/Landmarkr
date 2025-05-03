package com.example.demo.model;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class GoogleUser {
    private String email;
    private String firstName;
    private String lastName;



    public GoogleUser(String userInfo) {
        JsonObject jsonObject = JsonParser.parseString(userInfo).getAsJsonObject();
        this.email = jsonObject.get("email").getAsString();
        this.firstName = jsonObject.get("given_name").getAsString();
        this.lastName = jsonObject.get("family_name").getAsString();
    }


    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

}
