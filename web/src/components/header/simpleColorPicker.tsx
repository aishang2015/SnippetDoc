import { useState } from 'react';
import './simpleColorPicker.less';

export function SimpleColorPicker(props: { value?: string, onChange?: (value: string) => void }) {

    const [selected, setSelected] = useState('');

    const colorList = [
        "#f5222d",
        "#fa541c",
        "#fa8c16",
        "#faad14",
        "#fadb14",
        "#a0d911",
        "#52c41a",
        "#13c2c2",
        "#1890ff",
        "#2f54eb",
        "#722ed1",
        "#eb2f96",
    ];

    const triggerChange = (color: string) => {
        props.onChange?.(color);
    };

    const selectColor = (color: string) => {
        setSelected(color);
        triggerChange(color);
    }

    if (props.value) {
        triggerChange(props.value);
    }

    return (
        <>
            <div className="color-group">
                {colorList.map(color => (
                    <div className={selected === color ? "color-option color-option-select" : "color-option"}
                        style={{ backgroundColor: color }} onClick={() => selectColor(color)}></div>
                ))}
            </div>
        </>
    );
}

//export const ColorPicker = forwardRef(SimpleColorPicker);