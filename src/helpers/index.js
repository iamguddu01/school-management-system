
export const nameShortner = (name) => {
    let arr = name.split(" ");
    const first = arr[0] || "";
    const second = arr[1] || "";

    return (first?.[0] || "") + (second[0] || "");
}
