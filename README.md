<div align="center">
<img src="https://github.com/ankita06nandy/ManRaksha/blob/main/frontend/public/ManRaksha_logo.png" alt="ManRaksha Logo" width="150">
<h1>MANRAKSHA</h1>
<h3>AI-Based Predictive Personnel Stress &amp; Welfare Monitoring System</h3>

<p>
  <b>“Detect Early. Support Privately. Protect Always.”</b>
</p>

</div>

---
# Project Overview 
The proposed MANRAKSHA system is an AI-powered personnel welfare platform that analyzes organizational and voluntarily provided wellness data to identify early indicators of stress and burnout.

## Key components:
HR, duty, workload and deployment data analysis.
Secure mobile-based wellness self-assessment.
Optional biometric/wearable data where authorized.
AI-based stress, burnout and fatigue detection.
Predictive risk scoring and stress trajectory analysis.
Explainable welfare alerts for authorized officers.
Personalized recommendations for counselling, rest and workload balancing.
Privacy-preserving architecture with encryption, anonymization and RBAC.
## Core principle: 
Predict the need for support, not the fitness of the individual.

# Key Features 
*Stress Trajectory:* Tracks changing risk instead of relying on one-time assessments.
*Predictive Analytics:* Identifies rising risk before it becomes critical.
*Voluntary Wellness App:* Enables confidential self-assessment.
*Optional Biometrics:* Supports authorized physiological/wearable data.
*Explainable AI:* Shows factors influencing risk predictions.
*Personalized Interventions:* Recommends appropriate welfare actions.
*Automated Alerts:* Provides timely notifications to authorized personnel.
*Privacy-by-Design:* Protects sensitive personnel information.
*Human-in-the-Loop:* AI supports welfare officers rather than replacing human judgment.

# System Architechure 
<table>
  <tr>
    <th colspan="2">DATA PROCESSING LAYER</th>
  </tr>
  <tr>
    <td colspan="2" align="center">
      Cleaning & Validation • Feature Engineering • Anonymization • Missing-Value Handling
    </td>
  </tr>

  <tr>
    <th colspan="2">⬇️</th>
  </tr>

  <tr>
    <th colspan="2">AI / ML ENGINE</th>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <b>Stress & Welfare Risk Prediction Model</b><br>
      Risk Score + Trend → Low / Moderate / High
    </td>
  </tr>

  <tr>
    <th colspan="2">⬇️</th>
  </tr>

  <tr>
    <th>EXPLAINABLE AI LAYER</th>
    <th>EARLY WARNING SYSTEM</th>
  </tr>
  <tr>
    <td>
      • Why is risk increasing?<br>
      • Key contributing factors<br>
      • Risk trend explanation
    </td>
    <td>
      • Risk threshold detection<br>
      • Trend-based alerts<br>
      • Priority identification
    </td>
  </tr>

  <tr>
    <th colspan="2">⬇️</th>
  </tr>

  <tr>
    <th colspan="2">WELFARE OFFICER DASHBOARD</th>
  </tr>
  <tr>
    <td colspan="2" align="center">
      Risk Overview • Personnel Trends • Contributing Factors • Priority Attention
    </td>
  </tr>

  <tr>
    <th colspan="2">⬇️</th>
  </tr>

  <tr>
    <th colspan="2">PERSONNEL WELLNESS APP</th>
  </tr>
  <tr>
    <td colspan="2" align="center">
      Voluntary Self-Assessment • Wellness Check-ins • Personalized Recommendations
    </td>
  </tr>
</table>

# User Roles and Access 

<table>
<tr>

<td align="center" width="33%">

### Personnel

Access personal wellness insights, self-assessments, support resources and wellbeing guidance.

<br>

</td>

<td align="center" width="33%">

###  Welfare Officer

Monitor welfare indicators, understand risk factors and support early human-led intervention.

<br>

</td>

<td align="center" width="33%">

###  Administrator

View aggregate welfare trends, workload patterns and system-level analytics.

<br>

</td>

</tr>
</table>


# Technology Stack

<table>
  <tr>
    <th>Layer</th>
    <th>Technologies</th>
  </tr>

  <tr>
    <td><b>Frontend</b></td>
    <td>React.js • Vite</td>
  </tr>

  <tr>
    <td><b>Backend</b></td>
    <td>Python • FastAPI • REST APIs</td>
  </tr>

  <tr>
    <td><b>AI / ML</b></td>
    <td>Python • Scikit-learn • Explainable AI Techniques</td>
  </tr>

  <tr>
    <td><b>Database</b></td>
    <td>PostgreSQL</td>
  </tr>

  <tr>
    <td><b>Security</b></td>
    <td>Encryption • Authentication & Authorization • Anonymization</td>
  </tr>

  <tr>
    <td><b>Deployment</b></td>
    <td>Vercel • Cloud Infrastructure</td>
  </tr>
</table>

# System Strengths

## Feasibility
Uses existing AI/ML and predictive analytics technologies.
Can integrate with existing HRMS and personnel management systems.
Requires minimal additional hardware for initial deployment.
Supports secure cloud or on-premise implementation.
Mobile wellness application enables convenient self-reporting.
Modular architecture allows phased implementation and testing.
Can be scaled from a pilot unit to force-wide deployment.
Existing cybersecurity technologies can support encryption and access control.
## Viability
Enables early and preventive welfare intervention.
Reduces dependence on manual monitoring.
Supports evidence-based workload and personnel management.
Improves visibility of workforce-level welfare trends.
Continuous monitoring enables identification of changing risk patterns.
Privacy safeguards can improve personnel trust and participation.
Feedback mechanisms allow continuous improvement of the system.
Supports long-term organizational resilience and readiness.
## Business / Market Potential
Central Armed Police Forces (CAPFs)
Indian Armed Forces
State Police Organizations
Disaster Response & Emergency Services
Government departments with high-stress workforces
Corporate employee wellness platforms
International security and workforce-welfare organizations
## Impact
Risk Identification at Early Stages – Picks up signs of stress and burnout before they reach critical levels.
Well-being – Facilitates counseling and welfare measures.
Fatigue Reduction – Assists in recognizing overwork and inadequate recuperation periods.
Readiness Enhancement – Promotes healthier and sturdier staff.
Effective Planning of Welfare Services – Based on factual information about the organization.
Prevention of Stress-Induced Cases – Motivates preventive action.
Retention of Employees – Appropriate welfare can lead to job satisfaction.
## Benefits
Tailored welfare assistance.
Optimized workload sharing.
Efficient welfare decision-making process.
Monitoring stress trends continuously.
Less reliance on manual reporting.
Effective resource management.
Resilience building in personnel.
Organizational trust through privacy.
Scalability across several forces.
Proactive welfare management rather than reactive responses.
## Privacy, Ethics & Security
Because the system handles highly sensitive personnel information, privacy is a core design requirement.
Consent-based wellness and biometric data collection.
Collection of only necessary data.
Encryption during storage and transmission.
Anonymization/pseudonymization wherever possible.
Strict Role-Based Access Control.
No automatic disciplinary action based on AI predictions.
Human verification before significant welfare decisions.
Transparent and explainable risk assessments.
Secure audit logs and controlled data retention.
System designed to minimize stigmatization and misuse.
## Future Scope
Integration with advanced wearable devices.
Multilingual wellness applications.
Voice-based or conversational wellness assessments.
Federated learning for privacy-preserving model training.
Advanced time-series and multimodal AI models.
Unit-level workforce stress forecasting.
Integration with existing government welfare platforms.
Expansion to disaster-response and other high-stress occupations.

# Technical Challenges & Mitigation

<table>
  <tr>
    <th>Challenge</th>
    <th>Proposed Approach</th>
  </tr>

  <tr>
    <td><b>Sensitive personal data</b></td>
    <td>Encryption + anonymization + RBAC</td>
  </tr>

  <tr>
    <td><b>False positives/negatives</b></td>
    <td>Model validation + continuous monitoring</td>
  </tr>

  <tr>
    <td><b>Personnel distrust</b></td>
    <td>Consent + transparency + welfare-only usage</td>
  </tr>

  <tr>
    <td><b>AI bias</b></td>
    <td>Fairness evaluation and periodic auditing</td>
  </tr>

  <tr>
    <td><b>Lack of explainability</b></td>
    <td>Explainable AI and contributing-factor display</td>
  </tr>

  <tr>
    <td><b>Cybersecurity threats</b></td>
    <td>Secure APIs, encryption and access controls</td>
  </tr>

  <tr>
    <td><b>Data availability</b></td>
    <td>Multi-source data + voluntary self-reporting</td>
  </tr>

  <tr>
    <td><b>Misuse of predictions</b></td>
    <td>Human-in-the-loop decision-making</td>
  </tr>
</table>

# Acknowledgement
The project is informed by research and frameworks related to occupational mental health, military mental healthcare, responsible AI, and AI risk management.

Special acknowledgement to the research and public-health organizations whose work contributed to the conceptual foundation of MANRAKSHA.

# Disclaimer

MANRAKSHA is a welfare decision-support system.

AI predictions are advisory and should not be treated as medical diagnoses, fitness assessments, or disciplinary decisions. Final welfare decisions must remain with qualified human professionals.



