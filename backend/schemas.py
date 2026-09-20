from pydantic import BaseModel


class PersonnelData(BaseModel):
    Age: float
    Gender: float

    AvegWklyFreqWExerc: float
    AvegDuratEcerc: float
    Intensity: float

    LivinPlace: float
    RelatshpStatus: float

    Self_Regulation: float
    Anxiety_Worry_Control: float
    Relationship_Stability: float
    Adaptibility_to_Environment: float
    Task_Persistent: float
    Stress_Recovery: float

    Unexpected_Stress: float
    Lack_of_Control: float
    Anxiety: float
    Overwhelmed: float
    Irritability: float
    Confidence: float
    Efficiency: float
    Situation_Mastery: float
    Operation_Control: float
    Accumulated_Pressure: float

    High_BP: float
    Blood_Sugar: float
    Hyperlipidimia: float
    Heart_Disease: float
    Sleep_Disorder: float
    Chronic_Bronchitis: float
    Migraine: float
    High_BMI: float
    Atherosclerosis: float
    Pneumonia: float