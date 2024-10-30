import {getBuildInfo} from "@/lib/get-buildInfo";


export function BuildNumber() {
    const {version, buildTime} = getBuildInfo();

    function formatDate(date: Date) {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
    
    
    return (
        <div>
            <p>Versão: {version}</p>
            <p>Build: {formatDate(new Date(buildTime))}</p>
        </div>
    );
}