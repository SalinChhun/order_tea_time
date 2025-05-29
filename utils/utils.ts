export function getSugarText(level:any) {
    switch (level) {
        case 'NO_SUGAR':
            return '0%';
        case 'LOW_SUGAR':
            return '25%';
        case 'NORMAL_SUGAR':
            return '50%';
        case 'HIGH_SUGAR':
            return '75%';
        case 'EXTRA_SUGAR':
            return '100%';
        default:
            return '';
    }
}

export function getIceText(level:any) {
    switch (level) {
        case 'NO_ICE':
            return 'No Ice';
        case 'LESS_ICE':
            return 'Less Ice';
        case 'NORMAL_ICE':
            return 'Regular Ice';
        case 'EXTRA_ICE':
            return 'Extra Ice';
        case 'HOT':
            return 'Hot';
        default:
            return '';
    }
}
