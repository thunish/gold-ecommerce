import cron from "node-cron";
import axios from "axios";
import { db } from "./db";
import { MetalPrices, metalPrices } from "@shared/schema";
import {eq} from "drizzle-orm";

const TROY_OUNCE_TO_GRAM = 28.35;

export async function updateRatesOnce() {
    try{
        const goldRes=await axios.get("https://www.goldapi.io/api/XAU/INR", {
            headers:{
                "x-access-token": process.env.GOLD_API_KEY
            }
        });
        const silverRes = await axios.get(
            "https://www.goldapi.io/api/XAG/INR",
            {
            headers: { "x-access-token": process.env.GOLD_API_KEY! },
            }
        );
        const goldPerGram = goldRes.data.price / TROY_OUNCE_TO_GRAM;
        const silverPerGram = silverRes.data.price / TROY_OUNCE_TO_GRAM;

        await db.update(metalPrices).set({
            pricePerGram:goldPerGram.toFixed(2),
            updatedAt:new Date(),
        })
        .where(eq(metalPrices.metal, "gold"));

        await db.update(metalPrices)
        .set({
        pricePerGram: silverPerGram.toFixed(2),
        updatedAt: new Date(),
        })
        .where(eq(metalPrices.metal, "silver"));
        console.log("Metal prices updated");
    }
    catch(err){
        console.error("Price update failed", err);
    }
}


export function startRatesUpdate(){
    updateRatesOnce();
    cron.schedule("0 */16 * * *", async()=>{
        try{
            const goldRes=await axios.get("https://www.goldapi.io/api/XAU/INR", {
                headers:{
                    "x-access-token": process.env.GOLD_API_KEY
                }
            });
            const silverRes = await axios.get(
                "https://www.goldapi.io/api/XAG/INR",
                {
                headers: { "x-access-token": process.env.GOLD_API_KEY! },
                }
            );
            const goldPerGram = goldRes.data.price / TROY_OUNCE_TO_GRAM;
            const silverPerGram = silverRes.data.price / TROY_OUNCE_TO_GRAM;

            await db.update(metalPrices).set({
                pricePerGram:goldPerGram.toFixed(2),
                updatedAt:new Date(),
            })
            .where(eq(metalPrices.metal, "gold"));

            await db.update(metalPrices)
            .set({
            pricePerGram: silverPerGram.toFixed(2),
            updatedAt: new Date(),
            })
            .where(eq(metalPrices.metal, "silver"));
            console.log("Metal prices updated");
        }
        catch(err){
            console.error("Price update failed", err);
        }
    })
}