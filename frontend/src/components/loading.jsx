import { bouncy } from "ldrs"

export default function Loading() {
    bouncy.register();
    return (
        <div className="flex justify-center">
            <l-bouncy
                size="45"
                speed="1.75"
                color="gray"
            />
        </div>
    )
}