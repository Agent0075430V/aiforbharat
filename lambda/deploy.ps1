# deploy.ps1
# Run from lambda/ folder: .\deploy.ps1
# Requires: AWS CLI configured with appropriate IAM permissions

$region = "ap-south-1"

$lambdas = @(
    @{ name = "mediora-bedrock-generate"; zip = "dist\bedrock.zip" },
    @{ name = "mediora-dynamo-crud";      zip = "dist\dynamo.zip" },
    @{ name = "mediora-s3-upload";        zip = "dist\s3.zip" },
    @{ name = "mediora-transcribe";       zip = "dist\transcribe.zip" },
    @{ name = "mediora-weekly-plan";      zip = "dist\weeklyPlan.zip" }
)

foreach ($lambda in $lambdas) {
    Write-Host "Deploying $($lambda.name)..." -ForegroundColor Cyan
    aws lambda update-function-code `
        --function-name $lambda.name `
        --zip-file "fileb://$($lambda.zip)" `
        --region $region | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $($lambda.name)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED: $($lambda.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Deploy complete. Check CloudWatch logs if anything still fails." -ForegroundColor Yellow
