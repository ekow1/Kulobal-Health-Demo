import Image from "next/image";

export default function Logo(){
    return(
        <div>
            <Image
                src="/logo.webp"
                alt="Logo"
                width={200}
                height={100}
            
            />
        </div>
    )
}