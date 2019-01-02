export function setOptions(maxTime: number) {
    const time: number = Number(maxTime) + 3;
    return {
        format: {
            minorLabels: {
              millisecond: 'SSS',
            },
            majorLabels: {
              millisecond: '',
            },
        },
        min: 0,
        max: time,
        start: 0,
        end: time,
        multiselect: true,
        stack: false,
        editable: {
            updateTime: false,
            updateGroup: false,
            remove: false,
            overrideItems: false,
        },
        groupOrder: (a: any, b: any) => a.id - b.id,
        moveable: false,
        zoomable: false,
    };
}
