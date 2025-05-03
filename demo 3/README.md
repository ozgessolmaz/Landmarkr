# LABORANT RAPORLAMA UYGULAMASI

## Proje Açıklaması
Bu proje, laboratuvar test sonuçlarını yönetmek ve raporlamak için geliştirilmiş bir sistemdir. **Spring Boot (Java)** ve **React** kullanılarak oluşturulmuştur.

## Teknolojiler
- **Backend:** Spring Boot (Java), Spring Data JPA, Spring Security
- **Frontend:** React, Axios, React Router
- **Veritabanı:** PostgreSQL / MySQL
- **Diğer:** Docker, Maven, Node.js

## Gereksinimler
Aşağıdaki araçların sisteminizde yüklü olması gerekmektedir:
- **Java 17+**
- **Maven 3+**
- **Node.js 18+ ve npm 9+**
- **PostgreSQL**
- **Docker** (Eğer PostgreSQL'i Docker ile çalıştırmak istiyorsanız)

---

## **Kurulum ve Çalıştırma**

### **Backend (Spring Boot) Kurulumu**
1. **Spring Boot projesini başlatın:**
    - [start.spring.io](https://start.spring.io/) adresine gidin.
    - **Gradle veya Maven** seçin.
    - **Spring Web, Spring Data JPA, Spring Security, Lombok, PostgreSQL Driver** gibi bağımlılıkları ekleyin.
    - **Generate** butonuna tıklayarak proje dosyalarını indirin.

2. **Projeyi açın ve bağımlılıkları yükleyin:**
   ```
   cd demo3
   mvn clean install

3. **Veritabanı yapılandırması(application.properties veya application.yml)**
   ```
   spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=yourpassword
   spring.datasource.driver-class-name=org.postgresql.Driver

4. **Uygulamayı çalıştırın**
    ```
    mvn spring-boot:run
   
















