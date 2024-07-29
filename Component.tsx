import { addPropertyControls, ControlType, useIsOnFramerCanvas } from "framer"
import { useEffect, useState } from "react"
import Fuse from "fuse.js"
import { createClient } from "@supabase/supabase-js"

// Fake data from api
const fakeModels = [
    {
        name: "can",
        tags: ["Food & drink"],
        embed: `<iframe src="https://embed.3dprobox.com/models/BH4s36H2wGeFSbgVJChoKe5r?info_buttons=true" title="3D ProBox Model Viewer" style="width: 100%; height: 100%;" frameborder="0" allow="web-share; xr-spatial-tracking" loading="lazy" scrolling="no" referrerpolicy="origin-when-cross-origin" allowfullscreen="allowfullscreen"></iframe>`,
    },
    {
        name: "ape",
        tags: ["Animals & Pets", "Art & Abstract"],
        embed: `<iframe src="https://embed.3dprobox.com/models/JzofnhFkdHQ1kntUn1Vx4bir?info_buttons=true" title="3D ProBox Model Viewer" style="width: 100%; height: 100%;" frameborder="0" allow="web-share; xr-spatial-tracking" loading="lazy" scrolling="no" referrerpolicy="origin-when-cross-origin" allowfullscreen="allowfullscreen"></iframe>`,
    },
    {
        name: "car",
        tags: ["Cars & Vehicles"],
        embed: `<iframe src="https://embed.3dprobox.com/models/U8xaE7Ay7SKvRfqHSjsq8JBw?info_buttons=true" title="3D ProBox Model Viewer" style="width: 100%; height: 100%;" frameborder="0" allow="web-share; xr-spatial-tracking" loading="lazy" scrolling="no" referrerpolicy="origin-when-cross-origin" allowfullscreen="allowfullscreen"></iframe>`,
    },
]

// A supabase client for interacting with the database
const supabase = createClient(
    "https://apapjxotwyeqimuinkwy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwYXBqeG90d3llcWltdWlua3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MjkzMDYsImV4cCI6MjAzNzQwNTMwNn0.AqjEiyoUhyLhkgrEF6NaLrz63eotjGM20XJa-A98_lE"
)

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicHeight 300
 * @framerIntrinsicWidth 400
 * @framerDisableUnlink
 * Options for framer and the main component function
 */
export default function ProBox_3D(props) {
    const {
        id,
        toggle,
        user,
        model_name,
        embed,
        customize: {
            autoload,
            buttonload,
            info_buttons,
            bg_select,
            background_clr,
            background_img,
            radius,
        },
    } = props
    const frameStyle = {
        width: "100%",
        height: "100%",
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg_select == "Color" ? background_clr : "transparent",
        borderRadius: radius,
    }
    const [model, setModel] = useState("")

    // UseEffect hook to detect cahnges and get the model data (This works at the first load and prop changes)
    useEffect(() => {
        async function fetchModel(name) {
            // Fetch goes here the results will feed into Fuse
            console.log("Data fetched")
            const fuse = new Fuse(fakeModels, {
                keys: ["name", "tags"],
            })
            return fuse.search(name)[0].item
        }
        async function getModel() {
            const { data, error } = await supabase
                .from("user-model")
                .select("*")
                .eq("id", id)

            let found = false
            if (data.length > 0) {
                if (data[0].name == model_name && data[0].user == user) {
                    setModel(data[0].source)
                    found = true
                }
            }
            if (!found) {
                const fetched = await fetchModel(model_name)
                setModel(stripSource(fetched.embed))

                const { data, error } = await supabase
                    .from("user-model")
                    .upsert({
                        id: id,
                        user: user,
                        name: model_name,
                        source: stripSource(fetched.embed),
                    })
                    .select()
            }
        }
        getModel()
    }, [user, model_name])

    /* Here I check if a model is found and if not I display a loading screen 
    or a select model message depending on the enviroment */
    const source = toggle ? stripSource(embed) : model || ""
    console.log(background_img)
    if (source == "") {
        return (
            <div style={frameStyle}>
                {bg_select == "Image" && background_img ? (
                    <img
                        src={background_img?.src}
                        srcSet={background_img?.srcSet}
                        alt={background_img?.alt}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            objectPosition: `${background_img?.positionX} ${background_img?.positionY}`,
                        }}
                    />
                ) : (
                    ""
                )}
                {useIsOnFramerCanvas() ? (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                height: "120px",
                                width: "300px",
                                translate: "0px -6px",
                                position: "absolute",
                                borderRadius: radius,
                                opacity: "0.8",
                            }}
                        />
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                fontSize: "22px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontFamily: "sans-serif",
                                    fontWeight: 800,
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="45"
                                    viewBox="0 0 28 30"
                                >
                                    <g clip-path="url(#clip0_1273_4756)">
                                        <path
                                            d="M25.2281 6.38865L14.0962 0.142115L14.0374 0.111206L13.9785 0.142115L2.84668 6.38865L6.8007 8.6298C9.1548 5.98016 11.7509 5.44361 13.8957 5.4701C15.2586 5.46792 16.6069 5.75346 17.8548 6.30852C19.1026 6.86357 20.2226 7.67593 21.1433 8.69383L25.2281 6.38865Z"
                                            fill="#212936"
                                        />
                                        <path
                                            d="M0.152344 10.3411L0.453147 23.2294V23.2956L0.509818 23.3309L11.4586 29.9042L11.3779 25.0355C8.59006 24.329 6.36456 22.1938 5.40548 20.4274C4.38101 18.5174 3.58541 16.1681 4.42896 12.7456L0.152344 10.3411Z"
                                            fill="#212936"
                                        />
                                        <path
                                            d="M27.4818 10.3411L27.1809 23.2294V23.2956L27.1243 23.3309L16.1733 29.9042L16.254 25.0355C17.5446 24.748 18.7607 24.1872 19.8223 23.3899C20.8839 22.5928 21.7671 21.5771 22.4139 20.4097C23.4384 18.4997 24.1947 16.0864 23.3512 12.6617L27.4818 10.3411Z"
                                            fill="#212936"
                                        />
                                        <path
                                            d="M19.8899 12.7655V16.0776L17.4356 17.6188L17.4203 20.9198L14.3447 22.3241V16.0621L19.8899 12.7655Z"
                                            fill="#212936"
                                        />
                                        <path
                                            d="M16.9649 10.1732L19.9271 11.7255L13.8959 15.4151L8.20459 11.7343L11.0077 10.1798L13.9046 11.7255L16.9649 10.1732Z"
                                            fill="#212936"
                                        />
                                        <path
                                            d="M8.16321 12.6329L13.4817 16.0775V22.324L10.7898 21.0146L10.7789 17.5171L8.14795 16.0775L8.16321 12.6329Z"
                                            fill="#212936"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1273_4756">
                                            <rect
                                                width="27.5"
                                                height="30"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span style={{ translate: "0px 2px" }}>3D</span>
                                <span style={{ fontSize: "24px" }}>ProBox</span>
                            </div>
                            <p style={{ fontSize: "18px" }}>
                                Please select a model to display
                            </p>
                        </div>
                    </div>
                ) : (
                    <svg
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-500 -500 1000 1000"
                    >
                        <rect
                            opacity="0.6"
                            width="220"
                            height="80"
                            x="-110"
                            y="-40"
                            rx="20"
                            ry="20"
                            fill="white"
                        />
                        <circle fill="#000000" stroke="#000000" r="22" cx="-64">
                            <animate
                                attributeName="opacity"
                                calcMode="spline"
                                dur="1.8"
                                values="1;0;1;"
                                keySplines=".5 0 .5 1;.5 0 .5 1"
                                repeatCount="indefinite"
                                begin="-.4"
                            ></animate>
                        </circle>
                        <circle fill="#000000" stroke="#000000" r="22" cx="0">
                            <animate
                                attributeName="opacity"
                                calcMode="spline"
                                dur="1.8"
                                values="1;0;1;"
                                keySplines=".5 0 .5 1;.5 0 .5 1"
                                repeatCount="indefinite"
                                begin="-.2"
                            ></animate>
                        </circle>
                        <circle fill="#000000" stroke="#000000" r="22" cx="64">
                            <animate
                                attributeName="opacity"
                                calcMode="spline"
                                dur="1.8"
                                values="1;0;1;"
                                keySplines=".5 0 .5 1;.5 0 .5 1"
                                repeatCount="indefinite"
                                begin="0"
                            ></animate>
                        </circle>
                    </svg>
                )}
            </div>
        )
    }

    return (
        <div style={frameStyle}>
            {bg_select == "Image" && background_img ? (
                <img
                    src={background_img?.src}
                    srcSet={background_img?.srcSet}
                    alt={background_img?.alt}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        objectPosition: `${background_img?.positionX} ${background_img?.positionY}`,
                    }}
                />
            ) : (
                ""
            )}
            <iframe
                src={
                    source +
                    `?autoload=${autoload}&bg_transparent=true&buttonload=${buttonload}&info_buttons=${info_buttons}`
                }
                title="3D ProBox Model Viewer"
                style={{ width: "100%", height: "100%", position: "absolute" }}
                frameborder="0"
                allow="web-share; xr-spatial-tracking"
                loading="lazy"
                scrolling="no"
                referrerpolicy="origin-when-cross-origin"
                allowfullscreen="allowfullscreen"
            ></iframe>
        </div>
    )
}

// Here I configure framer ui elements to customize the model
ProBox_3D.defaultProps = {
    toggle: true,
    customize: {
        autoload: true,
        buttonload: false,
        info_buttons: true,
        bg_select: "Image",
        background_clr: "transparent",
        radius: 0,
    },
}
addPropertyControls(ProBox_3D, {
    toggle: {
        type: ControlType.Boolean,
        title: "Toggle",
        enabledTitle: "Embed",
        disabledTitle: "User",
    },
    user: {
        type: ControlType.String,
        title: "User ID",
        placeholder: "Enter 3DProBox ID",
        hidden(props) {
            return props.toggle
        },
    },
    model_name: {
        type: ControlType.String,
        title: "Search",
        placeholder: "Model name",
        hidden(props) {
            return props.toggle
        },
    },
    embed: {
        type: ControlType.String,
        title: "Code",
        placeholder: "Enter embed code",
        hidden(props) {
            return !props.toggle
        },
    },
    customize: {
        type: ControlType.Object,
        title: "Customize",
        icon: "effect",
        buttonTitle: "Object",
        controls: {
            autoload: { type: ControlType.Boolean, title: "Autoload" },
            buttonload: { type: ControlType.Boolean, title: "Buttonload" },
            info_buttons: { type: ControlType.Boolean, title: "Info Buttons" },
            bg_select: {
                type: ControlType.Enum,
                title: "Type",
                options: ["Color", "Image"],
                displaySegmentedControl: true,
            },
            background_clr: {
                type: ControlType.Color,
                title: "Background",
                hidden(props) {
                    return props.bg_select != "Color"
                },
            },
            background_img: {
                type: ControlType.ResponsiveImage,
                title: "Background",
                hidden(props) {
                    return props.bg_select != "Image"
                },
            },
            radius: { type: ControlType.BorderRadius, title: "Radius" },
        },
    },
})

// This strips the source from the iframe
function stripSource(iframe) {
    if (iframe == null) {
        return ""
    }
    let src_begin = iframe.indexOf('src="') + 5
    let src_end = iframe.indexOf("?")
    if (src_end === -1) {
        src_end = iframe.indexOf('" title="')
    }
    let raw_source = iframe.slice(src_begin, src_end)
    return raw_source
}
