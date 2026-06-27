# 📝 Paso a Paso

> *"Tus grandes sueños se conquistan con pequeños triunfos diarios."*

**Paso a Paso** es una aplicación web de productividad personal que ayuda a transformar la procrastinación en acción. Permite dividir metas ambiciosas en tareas simples y manejables, dándole seguimiento al progreso diario, semanal y mensual del usuario.

🔗 **[Ver demo en vivo](https://juliancubilla.github.io/paso-a-paso-app/)**

---

## ✨ Funcionalidades

- 🔐 **Autenticación de usuarios** — registro e inicio de sesión con Firebase Authentication
- ✅ **Gestión de tareas** — creación, edición y eliminación de tareas personales, guardadas en la nube
- 📊 **Seguimiento de progreso** — visualización de avance diario mediante anillos y barras de progreso
- 📅 **Vista de calendario** — seguimiento visual de constancia día por día
- 📈 **Estadísticas semanales y mensuales** — gráficos de barras con la evolución del usuario
- ⏱️ **Temporizador Pomodoro** — herramienta de enfoque integrada
- 🔒 **Datos privados por usuario** — cada usuario solo accede a su propia información, protegido por reglas de seguridad en Firestore

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de la aplicación |
| **CSS3** | Estilos y diseño visual |
| **JavaScript (Vanilla)** | Lógica de la aplicación e interactividad |
| **Firebase Authentication** | Manejo de usuarios y sesiones |
| **Firebase Firestore** | Base de datos en tiempo real para las tareas de cada usuario |

---

## 🔐 Seguridad

El acceso a los datos está protegido mediante reglas de seguridad de Firestore que garantizan que:
- Solo usuarios autenticados pueden leer o escribir datos
- Cada usuario únicamente puede acceder a sus propias tareas, nunca a las de otro usuario

---

## 🚀 Cómo correr el proyecto localmente

1. Cloná el repositorio
   ```bash
   git clone https://github.com/JulianCubilla/paso-a-paso-app.git
   ```
2. Abrí la carpeta del proyecto
3. Abrí `index.html` con un servidor local (por ejemplo, la extensión **Live Server** de VS Code)

> Nota: el proyecto usa una instancia de Firebase ya configurada. Para correr tu propia versión con tu propia base de datos, reemplazá el objeto `firebaseConfig` en `script.js` con las credenciales de tu propio proyecto de Firebase.

---

## 👤 Autor

**Julián Cubilla**
Junior DevOps Engineer | Técnico Superior en Programación

- 💼 [LinkedIn](https://www.linkedin.com/in/julian-cubilla-devops/)
- 🐙 [GitHub](https://github.com/JulianCubilla)
