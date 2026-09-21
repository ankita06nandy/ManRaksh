
<div align="center">
<img src="https://github.com/ankita06nandy/ManRaksh/blob/main/frontend/public/ManRaksh_logo.png" alt="ManRaksh Logo" width="150">
<h1>MANRAKSH</h1>
<h3>AI-Based Predictive Personnel Stress &amp; Welfare Monitoring System</h3>

<p>
  <b>“Detect Early. Support Privately. Protect Always.”</b>
</p>

</div>

<div align="center">

![AI](https://img.shields.io/badge/AI-Predictive_Welfare-FFDB58?style=flat-square)
![ML](https://img.shields.io/badge/ML-XGBoost-FFDB58?style=flat-square)
![XAI](https://img.shields.io/badge/XAI-SHAP-FFDB58?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React-FFDB58?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-FastAPI-FFDB58?style=flat-square)
![Database](https://img.shields.io/badge/Database-PostgreSQL-FFDB58?style=flat-square)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-FFDB58?style=flat-square)

<br>

![SIH](https://img.shields.io/badge/SIH-2026-1976D2?style=flat-square)
![Problem Statement](https://img.shields.io/badge/PS-SIH26186-DE3163?style=flat-square)
![Category](https://img.shields.io/badge/Category-Software-2E7D32?style=flat-square)
![Organization](https://img.shields.io/badge/Organization-Ministry_of_Home_Affairs-6A1B9A?style=flat-square)
![Theme](https://img.shields.io/badge/Theme-MedTech_|_BioTech_|_HealthTech-EF6C00?style=flat-square)

</div>


## Problem Statement

Uniformed personnel work in demanding environments that may involve prolonged duty hours, irregular schedules, operational pressure, deployment, limited recovery time, and other occupational stressors.

Conventional welfare mechanisms may rely heavily on self-reporting or manual observation, which can make it difficult to identify emerging patterns at an early stage.

The proposed system uses **Artificial Intelligence and Machine Learning to identify patterns associated with personnel stress and welfare risk**, providing early warnings and decision-support information to authorised personnel.

The system is intended to support welfare monitoring and early intervention while keeping final welfare decisions under appropriate human supervision.

---

# Proposed Solution

The proposed platform integrates personnel information, workload patterns, duty and deployment information, leave patterns, and voluntary wellness inputs into a secure analytical pipeline.

The system:

* Collects relevant personnel and operational indicators
* Preprocesses and validates incoming data
* Extracts meaningful features
* Uses an AI/ML model to identify stress and welfare-risk patterns
* Classifies the detected risk level
* Identifies contributing factors using explainable AI
* Generates appropriate early-warning alerts
* Provides welfare-oriented recommendations
* Allows authorised personnel to review the information
* Supports human-led welfare intervention

The system does **not** treat an AI prediction as a medical diagnosis. Its purpose is to provide an early-warning and decision-support mechanism.

---

# Solution Architecture

```mermaid
flowchart TB

    subgraph DATA["1. DATA COLLECTION"]
        D1["Personnel Profile Data"]
        D2["Duty & Workload Data"]
        D3["Leave & Deployment Data"]
        D4["Wellness / Self-Assessment"]
        D5["Operational & Behavioural Indicators"]
    end

    subgraph SECURITY["2. SECURE DATA INGESTION"]
        S1["Data Validation"]
        S2["Anonymisation / Pseudonymisation"]
        S3["Authentication & Access Control"]
    end

    subgraph PROCESSING["3. DATA PROCESSING"]
        P1["Data Cleaning"]
        P2["Missing Value Handling"]
        P3["Normalisation"]
        P4["Feature Engineering"]
        P5["Pattern Extraction"]
    end

    subgraph ML["4. AI / ML ENGINE"]
        M1["Predictive Model"]
        M2["Risk Classification"]
        M3["Explainable AI"]
        M4["Confidence & Pattern Analysis"]
    end

    subgraph WARNING["5. EARLY-WARNING SYSTEM"]
        W1["Risk Level"]
        W2["Contributing Factors"]
        W3["Early-Warning Alert"]
        W4["Welfare Recommendation"]
    end

    subgraph APPLICATION["6. APPLICATION"]
        A1["Personnel Dashboard"]
        A2["Wellness Check-In"]
        A3["Welfare Dashboard"]
        A4["Support Resources"]
    end

    subgraph HUMAN["7. HUMAN OVERSIGHT"]
        H1["Authorised Human Review"]
        H2["Welfare Decision"]
        H3["Human-Led Intervention"]
    end

    subgraph MONITORING["8. MONITORING & GOVERNANCE"]
        G1["Audit Logs"]
        G2["Model Performance Monitoring"]
        G3["Data Drift Monitoring"]
        G4["Model Improvement"]
    end

    D1 --> S1
    D2 --> S1
    D3 --> S1
    D4 --> S1
    D5 --> S1

    S1 --> S2
    S2 --> S3
    S3 --> P1

    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5

    P5 --> M1
    M1 --> M2
    M1 --> M3
    M3 --> M4

    M2 --> W1
    M3 --> W2
    M4 --> W3
    W1 --> W3
    W2 --> W3
    W3 --> W4

    W1 --> A1
    W4 --> A2
    W4 --> A4
    W3 --> A3

    A3 --> H1
    A1 --> H1
    H1 --> H2
    H2 --> H3

    H3 --> G1
    G1 --> G2
    G2 --> G3
    G3 --> G4
    G4 --> M1
```

---

# System Workflow

The system follows a continuous pipeline from data collection to human-led welfare support.

```mermaid
flowchart LR

    C["Data Collection"]
    P["Preprocessing"]
    F["Feature Engineering"]
    M["AI / ML Prediction"]
    R["Risk Classification"]
    X["Explainable Risk Factors"]
    A["Early-Warning Alert"]
    H["Human Review"]
    W["Welfare Support"]

    C --> P
    P --> F
    F --> M
    M --> R
    R --> X
    X --> A
    A --> H
    H --> W
```

### Workflow Stages

| Stage                   | Function                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Data Collection**     | Collect relevant personnel, workload, deployment, leave, and wellness indicators |
| **Preprocessing**       | Clean, validate, normalise, and prepare the data                                 |
| **Feature Engineering** | Convert raw information into meaningful analytical features                      |
| **AI/ML Prediction**    | Identify patterns associated with stress and welfare risk                        |
| **Risk Classification** | Categorise the predicted level of concern                                        |
| **Explainability**      | Identify the major factors contributing to the prediction                        |
| **Early Warning**       | Notify authorised users when elevated patterns are detected                      |
| **Human Review**        | Allow authorised personnel to interpret the situation in context                 |
| **Welfare Support**     | Enable appropriate human-led intervention or support                             |

---

# AI / ML Component

The AI/ML layer forms the predictive core of the system.

It analyses relevant features such as:

| Feature Category        | Examples                                                |
| ----------------------- | ------------------------------------------------------- |
| **Workload**            | Duty hours, workload frequency, overtime patterns       |
| **Duty Schedule**       | Shift irregularity, night-duty frequency                |
| **Deployment**          | Deployment duration, recent deployment activity         |
| **Leave**               | Leave frequency, gaps between leave periods             |
| **Recovery**            | Rest and recovery patterns                              |
| **Wellness**            | Self-reported stress, fatigue, sleep-related indicators |
| **Operational Factors** | Relevant changes in operational conditions              |
| **Historical Patterns** | Previous anonymised observations                        |

The exact features used will depend on the availability, quality, and suitability of the dataset.

### Machine Learning Pipeline

```mermaid
flowchart TB

    D["Training Dataset"]
    C["Data Cleaning"]
    F["Feature Engineering"]
    T["Model Training"]
    V["Validation & Evaluation"]
    P["Trained Model"]

    N["New Data"]
    N2["Preprocessing"]
    I["Prediction"]
    E["Explainable AI"]
    R["Risk Classification"]

    D --> C
    C --> F
    F --> T
    T --> V
    V --> P

    N --> N2
    N2 --> P
    P --> I
    I --> E
    I --> R
```

---

# Risk Classification

The system converts model outputs into understandable risk categories.

| Risk Level        | System Interpretation                                  | Possible System Response                            |
| ----------------- | ------------------------------------------------------ | --------------------------------------------------- |
| **Low**           | No significant elevated-risk pattern detected          | Continue routine monitoring                         |
| **Moderate**      | Some indicators may require attention                  | Offer a voluntary wellness check-in                 |
| **Elevated**      | Multiple indicators suggest increased welfare concern  | Generate an authorised early-warning alert          |
| **High Priority** | Strong combination of indicators requires human review | Prompt authorised personnel to review the situation |

The risk level is an **AI-generated welfare indicator**, not a medical diagnosis.

---

# Explainable AI

A prediction should not be presented as an unexplained number.

The system can provide the factors that contributed to an elevated prediction.

For example:

| Output                  | Example                                   |
| ----------------------- | ----------------------------------------- |
| **Risk Level**          | Elevated                                  |
| **Contributing Factor** | Increased workload                        |
| **Contributing Factor** | Irregular duty schedule                   |
| **Contributing Factor** | Reduced recovery period                   |
| **Contributing Factor** | Recent deployment activity                |
| **Suggested Next Step** | Consider a confidential wellness check-in |

This provides authorised users with context around the model output and makes the system more transparent.

---

# Early-Warning System

```mermaid
flowchart TB

    P["AI Prediction"]
    R{"Risk Level"}

    L["Low"]
    M["Moderate"]
    E["Elevated"]
    H["High Priority"]

    L1["Routine Monitoring"]
    M1["Wellness Check-In"]
    E1["Authorised Early Warning"]
    H1["Human Review"]

    P --> R

    R --> L
    R --> M
    R --> E
    R --> H

    L --> L1
    M --> M1
    E --> E1
    H --> H1
```

The purpose of the warning mechanism is to identify potentially concerning patterns **before they become difficult to address**, while avoiding automatic conclusions about an individual's health or fitness.

---

# Human-in-the-Loop

Human oversight is a central part of the proposed system.

```mermaid
flowchart LR

    A["AI Detects Pattern"]
    B["AI Explains Factors"]
    C["System Generates Alert"]
    D["Authorised Human Reviews"]
    E["Human Makes Decision"]
    F["Human-Led Welfare Support"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
```

The system provides information and recommendations, while authorised personnel retain responsibility for deciding whether any intervention is appropriate.

The system should not independently:

* Diagnose a mental-health condition
* Make disciplinary decisions
* Penalise personnel based solely on a prediction
* Force counselling or support
* Initiate consequential intervention without appropriate human review

---

# Application Modules

| Module                   | Purpose                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| **Authentication**       | Secure access to the platform                                       |
| **Personnel Dashboard**  | Display individual wellness information                             |
| **Wellness Check-In**    | Allow personnel to voluntarily provide current wellness information |
| **Risk Analysis**        | Display AI-generated risk indicators                                |
| **Explainability**       | Show relevant contributing factors                                  |
| **Early-Warning Alerts** | Notify authorised users of elevated patterns                        |
| **Welfare Dashboard**    | Provide authorised welfare personnel with relevant insights         |
| **Support Resources**    | Provide access to appropriate welfare resources                     |
| **Trend Monitoring**     | Display changes in relevant indicators over time                    |

---

# Privacy & Security

Personnel welfare information can be sensitive. The system therefore incorporates privacy and security throughout the data pipeline.

```mermaid
flowchart TB

    U["User / Data Source"]
    A["Authentication"]
    R["Role-Based Access Control"]
    V["Data Validation"]
    P["Anonymisation / Pseudonymisation"]
    E["Encrypted Storage"]
    M["Controlled ML Processing"]
    O["Role-Based Output"]
    L["Audit Logging"]

    U --> A
    A --> R
    R --> V
    V --> P
    P --> E
    E --> M
    M --> O
    O --> L
```

### Security Measures

* Authentication and authorisation
* Role-Based Access Control
* Secure data transmission
* Encryption of sensitive information
* Data minimisation
* Anonymisation or pseudonymisation where appropriate
* Controlled access to welfare information
* Audit logging
* Privacy-aware model development

---

# Technology Stack

| Layer                | Proposed Technology                      |
| -------------------- | ---------------------------------------- |
| **Frontend**         | React +Vite                              |
| **Styling**          | CSS, JavaScript                          |
| **Backend**          | Python + FastAPI + Uvicorn               |
| **Machine Learning** | XGBoost                                  |
| **ML Libraries**     | Pandas, NumPy, Scikit-learn, SHAP, Joblib|
| **Database**         | PostgreSQL + SQLAlchemy                  |
| **Authentication**   | JWT                                      |
| **Communication**    | REST API + JSON +CORS                    |
| **Deployment**       | Vercel + Render                          |
| **Version Control**  | Git & GitHub                             |
The final implementation may use a subset of these technologies depending on the implemented architecture.

---

# Model Evaluation

The predictive model should be evaluated using multiple performance measures.

| Metric               | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| **Accuracy**         | Measures overall correct predictions                          |
| **Precision**        | Measures how often positive predictions are correct           |
| **Recall**           | Measures the ability to identify relevant elevated-risk cases |
| **F1 Score**         | Balances precision and recall                                 |
| **Confusion Matrix** | Shows different types of prediction outcomes                  |
| **ROC-AUC**          | Measures the model's ability to distinguish between classes   |

Model evaluation should also consider false positives, false negatives, data quality, fairness, and calibration.

---

# Future Scope

The system can be extended through:

* Real-time operational data integration
* Advanced time-series analysis
* Improved explainable AI techniques
* Mobile application support
* Offline functionality for restricted environments
* Multilingual interfaces
* Integration with existing welfare-management systems
* Advanced anomaly detection
* Privacy-preserving machine learning
* Model drift and fairness monitoring
* Secure interoperability with authorised organisational systems

---

# Conclusion

The proposed system provides an AI-assisted approach to personnel welfare monitoring by combining **data analysis, predictive modelling, explainable AI, early-warning alerts, and human oversight**.

Rather than replacing existing welfare mechanisms, the platform is designed to provide an additional layer of early detection and decision support.

The overall approach can be summarised as:

> **Detect patterns early → Explain the contributing factors → Generate an appropriate warning → Enable human review → Support human-led welfare action.**
