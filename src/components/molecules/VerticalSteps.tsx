import React from 'react';
import { Collapse } from 'reactstrap';

type WrapperProps = {
    children: React.ReactElement[];
    activeStep: number;
    setActiveStep: Function;
};

type StepProps = {
    children?: any;
    title?: string;
    index?: number;
};

export default function VerticalSteps(props: WrapperProps) {
    const { children, activeStep, setActiveStep } = props;
    function renderChildren() {
        return children.map((child, i) => {
            return (
                <div key={i}>
                    <div className="vertical-steps-title">
                        <span className={`vertical-steps-title-badge ${activeStep === i ? 'active' : ''}`}>
                            {i + 1}
                        </span>
                        <span className="vertical-steps-title-text">{child.props.title || ''}</span>
                    </div>
                    <div className="vertical-steps-body">
                        <Collapse isOpen={activeStep === i}>{child}</Collapse>
                    </div>
                </div>
            );
        });
    }
    return <div className="vertical-steps-wrapper mb-1">{renderChildren()}</div>;
}

VerticalSteps.Step = function Step(props: StepProps) {
    const { children, title } = props;
    return <div className="vertical-steps-step">{children}</div>;
};
