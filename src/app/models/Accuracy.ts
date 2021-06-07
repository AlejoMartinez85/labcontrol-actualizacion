export interface Accuracy {
    _id?: string;
    analysts?: number;
    replicas?: number;
    validationMethodId?: string;
    matrix?: any[];
    anova?: {
        treatment?: {
            SS?: { type: Number },
            DF?: { type: Number },
            MS?: { type: Number },
            F?:  { type: Number },
            PV?: { type: Number }
        },
        residual?: {
            SS?: { type: Number },
            DF?: { type: Number },
            MS?: { type: Number }
        },
        total?: {
            SS?: { type: Number },
            DF?: { type: Number }
        }
    };
    unidad?:string;
    repeatabilityStandardDeviation?: number;
    standardDeviationBetweenGroups?: number;
    reproducibilityStandardDeviation?: number;
}