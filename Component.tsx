import { addPropertyControls, ControlType, useIsOnFramerCanvas } from "framer"
import { useEffect, useState } from "react"
import Fuse from "fuse.js"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerDisableUnlink
 */

// Fake data from api
const fakeModels = [
    {
        name: "cheeseburger",
        tag: "Food & drink",
        embed: `<iframe src="https://embed.3dprobox.com/models/kAJXRgjdFC6fsswRkWR6BPL7?bg_transparent=true" title="3D ProBox Model Viewer" style="width: 100%; height: 100%;" frameborder="0" allow="web-share; xr-spatial-tracking" loading="lazy" scrolling="no" referrerpolicy="origin-when-cross-origin" allowfullscreen="allowfullscreen"></iframe>`,
    },
    {
        name: "can",
        tag: "Food & drink",
        embed: `<iframe src="https://embed.3dprobox.com/models/cLFk9q2dZLW3oSe1CidnVg3f" title="3D ProBox Model Viewer" style="width: 100%; height: 100%;" frameborder="0" allow="web-share; xr-spatial-tracking" loading="lazy" scrolling="no" referrerpolicy="origin-when-cross-origin" allowfullscreen="allowfullscreen"></iframe>`,
    },
    {
        name: "shoes",
        tag: "Fashion & Style",
        embed: `<iframe src="https://embed.3dprobox.com/models/ks7rQ7JdsC1VtXCzrZynP4zv?info_buttons=true" title="3D ProBox Model Viewer" style="width: 100%; height: 100%;" frameborder="0" allow="web-share; xr-spatial-tracking" loading="lazy" scrolling="no" referrerpolicy="origin-when-cross-origin" allowfullscreen="allowfullscreen"></iframe>`,
    },
]

const fuse = new Fuse(fakeModels, {
    keys: ["name", "tag"],
})

export default function ProBox_3D(props) {
    const {
        toggle,
        user,
        model,
        embed,
        customize: {
            autoload,
            buttonload,
            info_buttons,
            bg_toggle,
            background_clr,
            background_img,
            radius,
        },
    } = props

    const [data, setData] = useState("")

    let cookie = null
    const local = JSON.parse(localStorage.getItem("Model"))
    if (local != null) {
        if (local.name == model) {
            cookie = local.embed
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                if (cookie == null) {
                    const result = await getModel(user, model)
                    setData(result.embed)
                    localStorage.setItem(
                        "Model",
                        JSON.stringify({ name: model, embed: result })
                    )
                    console.log("fetched data")
                } else {
                    setData(cookie.embed)
                    console.log("used storage")
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [user, model])

    let iframe = toggle ? embed : data || ""
    if (iframe == "") {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 18,
                    background: "white",
                }}
            >
                {useIsOnFramerCanvas()
                    ? "Please select a model to display"
                    : "Model loading"}
            </div>
        )
    }

    let src_begin = iframe.indexOf('src="') + 5
    let src_end = iframe.indexOf("?")
    if (src_end === -1) {
        src_end = iframe.indexOf('" title="')
    }
    let raw_source = iframe.slice(src_begin, src_end)

    const source =
        raw_source +
        `?autoload=${autoload}&buttonload=${buttonload}&info_buttons=${info_buttons}`

    const frameStyle = {
        width: "100%",
        height: "100%",
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg_toggle ? background_clr : "transparent",
        borderRadius: radius,
    }

    return (
        <div style={frameStyle}>
            {!bg_toggle ? (
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
                src={source}
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

ProBox_3D.defaultProps = {
    toggle: false,
    customize: {
        autoload: true,
        buttonload: false,
        info_buttons: true,
        bg_toggle: true,
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
    model: {
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
        hidden(props) {
            return !props.toggle
        },
    },
    customize: {
        type: ControlType.Object,
        title: "Customize",
        icon: "effect",
        controls: {
            autoload: { type: ControlType.Boolean, title: "Autoload" },
            buttonload: { type: ControlType.Boolean, title: "Buttonload" },
            info_buttons: { type: ControlType.Boolean, title: "Info Buttons" },
            bg_toggle: {
                type: ControlType.Boolean,
                title: "Type",
                enabledTitle: "Color",
                disabledTitle: "Image",
            },
            background_clr: {
                type: ControlType.Color,
                title: "Background",
                hidden(props) {
                    return !props.bg_toggle
                },
            },
            background_img: {
                type: ControlType.ResponsiveImage,
                title: "Background",
                hidden(props) {
                    return props.bg_toggle
                },
            },
            radius: { type: ControlType.BorderRadius, title: "Radius" },
        },
    },
})

async function getModel(user, model) {
    return fuse.search(model)[0].item
}
