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
                    setModel(data[0].embed)
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
                        embed: stripSource(fetched.embed),
                    })
                    .select()
            }
        }
        getModel()
    }, [user, model_name])

    /* Here I check if a model is found and if not I display a loading screen 
    or a select model message depending on the enviroment */
    let iframe = toggle ? stripSource(embed) : model || ""
    if (iframe == "") {
        return (
            <div style={frameStyle}>
                {bg_select == "Image" ? (
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
                            fontSize: "18px",
                        }}
                    >
                        Please select a model to display
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

    const source = toggle ? stripSource(iframe) : iframe
    return (
        <div style={frameStyle}>
            {bg_select == "Image" ? (
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
    toggle: false,
    customize: {
        autoload: true,
        buttonload: false,
        info_buttons: true,
        bg_select: "Color",
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
    let src_begin = iframe.indexOf('src="') + 5
    let src_end = iframe.indexOf("?")
    if (src_end === -1) {
        src_end = iframe.indexOf('" title="')
    }
    let raw_source = iframe.slice(src_begin, src_end)
    return raw_source
}
